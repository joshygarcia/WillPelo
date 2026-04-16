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
 * Incluye: La Liga, Champions League y Copa del Rey.
 */

const ESPN_SOCCER = "https://site.api.espn.com/apis/site/v2/sports/soccer";
const REVALIDATE_SECONDS = 60 * 60; // 1 hora

/** Ligas de las que consultamos partidos del Real Madrid. */
const LEAGUES: { slug: string; label: string }[] = [
  { slug: "esp.1", label: "La Liga" },
  { slug: "uefa.champions", label: "Champions League" },
  { slug: "esp.copa_del_rey", label: "Copa del Rey" },
];

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

async function wasPenaltyAwardedToRM(
  leagueSlug: string,
  fixtureId: string
): Promise<boolean> {
  const summary = await espnFetch<EspnSummaryResponse>(
    `${ESPN_SOCCER}/${leagueSlug}/summary?event=${fixtureId}`
  );
  if (!summary?.keyEvents) return false;
  return summary.keyEvents.some(keyEventIsPenaltyForRM);
}

/** Evento con la liga de la que proviene, para pasar a wasPenaltyAwardedToRM. */
interface TaggedEvent {
  event: EspnScheduleEvent;
  leagueSlug: string;
  leagueLabel: string;
}

/**
 * Devuelve los partidos del Real Madrid (La Liga + Champions + Copa) desde la
 * fecha de la promesa, anotando si hubo penalti a favor.
 * Ordenados de más reciente a más antiguo.
 */
export async function fetchEspnMatchesSincePromise(
  maxFixturesToAnnotate = 10
): Promise<Match[] | null> {
  // Fetch schedules from all leagues in parallel
  const scheduleResults = await Promise.all(
    LEAGUES.map(async (league) => {
      const schedule = await espnFetch<EspnScheduleResponse>(
        `${ESPN_SOCCER}/${league.slug}/teams/${RM_TEAM_ID_ESPN}/schedule`
      );
      return { league, events: schedule?.events ?? [] };
    })
  );

  // If ALL leagues failed (returned null → empty), treat as network error
  const anySuccess = scheduleResults.some((r) => r.events.length > 0 || r.events !== undefined);
  if (!anySuccess) return null;

  const sinceMs = PROMISE_DATE.getTime();

  // Flatten, tag with league info, filter completed + after promise date
  const allCompleted: TaggedEvent[] = [];
  for (const { league, events } of scheduleResults) {
    for (const ev of events) {
      const status = ev.competitions?.[0]?.status?.type;
      const isCompleted = status?.completed === true || status?.name === "STATUS_FULL_TIME";
      if (!isCompleted) continue;
      if (new Date(ev.date).getTime() < sinceMs) continue;
      allCompleted.push({
        event: ev,
        leagueSlug: league.slug,
        leagueLabel: league.label,
      });
    }
  }

  // Deduplicate by event ID (shouldn't happen, but just in case)
  const seen = new Set<string>();
  const unique = allCompleted.filter((t) => {
    if (seen.has(t.event.id)) return false;
    seen.add(t.event.id);
    return true;
  });

  // Sort newest first
  unique.sort(
    (a, b) => new Date(b.event.date).getTime() - new Date(a.event.date).getTime()
  );

  if (unique.length === 0) return [];

  const toAnnotate = unique.slice(0, maxFixturesToAnnotate);

  const annotated = await Promise.all(
    toAnnotate.map(async ({ event: ev, leagueSlug, leagueLabel }) => {
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

      const penalty = await wasPenaltyAwardedToRM(leagueSlug, ev.id);

      const match: Match = {
        fixtureId: Number(ev.id),
        date: ev.date,
        competition: leagueLabel,
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
