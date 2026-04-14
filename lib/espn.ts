import type { Match } from "./types";
import { PROMISE_DATE, RM_TEAM_ID_ESPN } from "./constants";

/**
 * Cliente para la API pública (no documentada) de ESPN.
 *
 * Ventajas frente a api-football.com:
 * - Gratis y sin API key.
 * - Cubre la temporada actual 2025/26 (el plan Free de api-football no).
 * - `summary` expone `keyEvents` con tipos `Penalty - Scored` / `Missed`
 *   / `Saved` por equipo, así podemos detectar penaltis pitados al Madrid.
 *
 * Solo usamos LaLiga (esp.1). Los partidos de Champions/Copa no se incluyen
 * aquí — si los necesitas habría que añadir `uefa.champions` y `esp.copa_del_rey`.
 */

const ESPN_BASE = "https://site.api.espn.com/apis/site/v2/sports/soccer/esp.1";
const REVALIDATE_SECONDS = 60 * 60; // 1 hora

interface EspnScheduleResponse {
  events?: EspnScheduleEvent[];
}

interface EspnLogo {
  href: string;
  rel?: string[];
  width?: number;
  height?: number;
}

interface EspnScheduleEvent {
  id: string;
  date: string;
  competitions?: Array<{
    status?: { type?: { name?: string; completed?: boolean } };
    competitors?: Array<{
      id: string;
      homeAway: "home" | "away";
      team?: {
        id: string;
        displayName?: string;
        abbreviation?: string;
        logo?: string;
        logos?: EspnLogo[];
      };
      score?: { value?: number; displayValue?: string } | string;
      winner?: boolean;
    }>;
  }>;
}

/**
 * De los varios logos que devuelve ESPN (default/dark/full/scoreboard), elige
 * el PNG full-color por defecto, con fallback al primero disponible.
 */
function pickDefaultLogo(logos: EspnLogo[] | undefined): string | undefined {
  if (!logos || logos.length === 0) return undefined;
  const def = logos.find(
    (l) => l.rel?.includes("default") && !l.rel.includes("dark")
  );
  return def?.href ?? logos[0]?.href;
}

interface EspnSummaryResponse {
  keyEvents?: EspnKeyEvent[];
}

interface EspnKeyEvent {
  type?: { text?: string };
  team?: { id?: string; displayName?: string };
  text?: string;
  scoringPlay?: boolean;
}

async function espnFetch<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      console.error(`[espn] ${url} ${res.status} ${res.statusText}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error("[espn] fetch error", err);
    return null;
  }
}

/**
 * Normaliza el score de ESPN, que puede venir como objeto `{value, displayValue}`
 * o como string (cuando es un `$ref` sin resolver).
 */
function readScore(
  score: { value?: number; displayValue?: string } | string | undefined
): number | null {
  if (!score) return null;
  if (typeof score === "string") {
    const n = Number(score);
    return Number.isFinite(n) ? n : null;
  }
  if (typeof score.value === "number") return score.value;
  if (score.displayValue) {
    const n = Number(score.displayValue);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function keyEventIsPenaltyForRM(ev: EspnKeyEvent): boolean {
  const typeText = (ev.type?.text || "").toLowerCase();
  const teamName = (ev.team?.displayName || "").toLowerCase();
  const isRm = teamName.includes("real madrid") && !teamName.includes("real madrid cf ii");
  if (!isRm) return false;
  // ESPN tags penalty events as:
  // "Penalty - Scored" | "Penalty - Missed" | "Penalty - Saved"
  // Any of those means a penalty was awarded TO Real Madrid.
  return typeText.startsWith("penalty");
}

async function wasPenaltyAwardedToRM(fixtureId: string): Promise<boolean> {
  const summary = await espnFetch<EspnSummaryResponse>(
    `${ESPN_BASE}/summary?event=${fixtureId}`
  );
  if (!summary?.keyEvents) return false;
  return summary.keyEvents.some(keyEventIsPenaltyForRM);
}

/**
 * Devuelve los partidos de LaLiga del Real Madrid desde la fecha de la promesa,
 * anotando si hubo penalti a favor. Ordenados de más reciente a más antiguo.
 */
export async function fetchEspnMatchesSincePromise(
  maxFixturesToAnnotate = 8
): Promise<Match[] | null> {
  const schedule = await espnFetch<EspnScheduleResponse>(
    `${ESPN_BASE}/teams/${RM_TEAM_ID_ESPN}/schedule`
  );
  if (!schedule?.events) return null;

  const sinceMs = PROMISE_DATE.getTime();

  const completed = schedule.events
    .filter((e) => {
      const status = e.competitions?.[0]?.status?.type;
      return status?.completed === true || status?.name === "STATUS_FULL_TIME";
    })
    .filter((e) => new Date(e.date).getTime() >= sinceMs)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (completed.length === 0) return [];

  const toAnnotate = completed.slice(0, maxFixturesToAnnotate);

  const annotated = await Promise.all(
    toAnnotate.map(async (ev) => {
      const comp = ev.competitions?.[0];
      const competitors = comp?.competitors ?? [];
      const rm = competitors.find((c) => c.team?.id === String(RM_TEAM_ID_ESPN));
      const opp = competitors.find((c) => c.team?.id !== String(RM_TEAM_ID_ESPN));
      if (!rm || !opp) return null;

      const goalsFor = readScore(rm.score) ?? 0;
      const goalsAgainst = readScore(opp.score) ?? 0;
      let result: Match["result"] = "D";
      if (goalsFor > goalsAgainst) result = "W";
      else if (goalsFor < goalsAgainst) result = "L";

      const penalty = await wasPenaltyAwardedToRM(ev.id);

      const match: Match = {
        fixtureId: Number(ev.id),
        date: ev.date,
        competition: "La Liga",
        opponent: opp.team?.displayName || opp.team?.abbreviation || "???",
        opponentLogo: pickDefaultLogo(opp.team?.logos) ?? opp.team?.logo,
        homeAway: rm.homeAway === "home" ? "H" : "A",
        goalsFor,
        goalsAgainst,
        result,
        penaltyAwardedToRM: penalty,
        status: "FT",
      };
      return match;
    })
  );

  return annotated.filter((m): m is Match => m !== null);
}
