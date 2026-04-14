import {
  ApfEventItem,
  ApfEventsResponse,
  ApfFixtureItem,
  ApfFixturesResponse,
  Match,
} from "./types";
import { CURRENT_SEASON, PROMISE_DATE, RM_TEAM_ID } from "./constants";
import { MOCK_MATCHES } from "./mock-matches";

export interface MatchesResult {
  matches: Match[];
  source: "api" | "mock" | "empty";
  reason?: string;
}

const BASE = "https://v3.football.api-sports.io";
const REVALIDATE_SECONDS = 60 * 60; // 1 hora

function getApiKey(): string | undefined {
  return process.env.API_FOOTBALL_KEY?.trim() || undefined;
}

interface ApfEnvelope {
  errors?: unknown;
  results?: number;
  response?: unknown;
}

async function apf<T extends ApfEnvelope>(
  path: string,
  params: Record<string, string | number>
): Promise<T | null> {
  const key = getApiKey();
  if (!key) return null;

  const qs = new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)])
  ).toString();

  const url = `${BASE}${path}?${qs}`;

  try {
    const res = await fetch(url, {
      headers: { "x-apisports-key": key },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) {
      console.error(`[api-football] ${path} ${res.status} ${res.statusText}`);
      return null;
    }
    const body = (await res.json()) as T;
    // api-football returns 200 with `errors` populated when plan/quota fails.
    if (body && body.errors && !Array.isArray(body.errors)) {
      const errObj = body.errors as Record<string, string>;
      if (Object.keys(errObj).length > 0) {
        console.warn(`[api-football] ${path} soft error`, errObj);
      }
    }
    return body;
  } catch (err) {
    console.error("[api-football] fetch error", err);
    return null;
  }
}

function extractSoftError(envelope: ApfEnvelope | null): string | undefined {
  if (!envelope || !envelope.errors) return undefined;
  if (Array.isArray(envelope.errors)) return undefined;
  const errObj = envelope.errors as Record<string, string>;
  const keys = Object.keys(errObj);
  if (keys.length === 0) return undefined;
  return `${keys[0]}: ${errObj[keys[0]]}`;
}

/**
 * Devuelve true si en los eventos del partido se concedió un penalti al
 * Real Madrid (lo haya marcado, fallado o parado).
 */
export function wasPenaltyAwarded(events: ApfEventItem[]): boolean {
  return events.some((e) => {
    if (e.team?.id !== RM_TEAM_ID) return false;
    const detail = (e.detail || "").toLowerCase();
    if (e.type === "Goal") {
      return (
        detail.includes("penalty") || detail === "missed penalty"
      );
    }
    if (e.type === "Var") {
      return detail.includes("penalty");
    }
    return false;
  });
}

function fixtureToMatch(item: ApfFixtureItem, penaltyAwardedToRM: boolean): Match {
  const isHome = item.teams.home.id === RM_TEAM_ID;
  const opponent = isHome ? item.teams.away.name : item.teams.home.name;
  const goalsFor = (isHome ? item.goals.home : item.goals.away) ?? 0;
  const goalsAgainst = (isHome ? item.goals.away : item.goals.home) ?? 0;

  let result: Match["result"] = "D";
  if (goalsFor > goalsAgainst) result = "W";
  else if (goalsFor < goalsAgainst) result = "L";

  return {
    fixtureId: item.fixture.id,
    date: item.fixture.date,
    competition: item.league.name,
    opponent,
    homeAway: isHome ? "H" : "A",
    goalsFor,
    goalsAgainst,
    result,
    penaltyAwardedToRM,
    status: item.fixture.status.short,
  };
}

/**
 * Devuelve los partidos disputados (estados FT/AET/PEN) del Real Madrid
 * desde la fecha de la promesa, anotando si hubo penalti a favor.
 *
 * Si la API no está configurada, falla, o devuelve 0 resultados (p.ej. el
 * plan Free no cubre la temporada 2025/26), cae a `MOCK_MATCHES` para que
 * la página siga funcionando con datos verosímiles.
 */
export async function fetchMatchesWithSource(
  maxFixturesToAnnotate = 8
): Promise<MatchesResult> {
  if (!isApiConfigured()) {
    return {
      matches: filterSincePromise(MOCK_MATCHES),
      source: "mock",
      reason: "API_FOOTBALL_KEY no configurada",
    };
  }

  const fixturesData = await apf<ApfFixturesResponse>("/fixtures", {
    team: RM_TEAM_ID,
    season: CURRENT_SEASON,
    status: "FT-AET-PEN",
  });

  const softError = extractSoftError(fixturesData);

  if (!fixturesData) {
    return {
      matches: filterSincePromise(MOCK_MATCHES),
      source: "mock",
      reason: "fallo de red o respuesta inválida",
    };
  }

  const eligible = (fixturesData.response ?? [])
    .filter((f) => new Date(f.fixture.date).getTime() >= PROMISE_DATE.getTime())
    .sort(
      (a, b) =>
        new Date(b.fixture.date).getTime() - new Date(a.fixture.date).getTime()
    );

  if (eligible.length === 0) {
    return {
      matches: filterSincePromise(MOCK_MATCHES),
      source: "mock",
      reason:
        softError ??
        `La API no devolvió partidos del Real Madrid desde ${PROMISE_DATE.toISOString().slice(0, 10)}`,
    };
  }

  // Limitamos cuántos fixtures pedimos eventos para mantener bajo el rate limit.
  const toAnnotate = eligible.slice(0, maxFixturesToAnnotate);

  const annotated = await Promise.all(
    toAnnotate.map(async (item) => {
      const eventsData = await apf<ApfEventsResponse>("/fixtures/events", {
        fixture: item.fixture.id,
      });
      const penalty = eventsData?.response
        ? wasPenaltyAwarded(eventsData.response)
        : false;
      return fixtureToMatch(item, penalty);
    })
  );

  return { matches: annotated, source: "api" };
}

/**
 * Wrapper retrocompatible: solo devuelve el array de partidos. Úsalo cuando
 * no necesites saber si los datos son reales o de muestra.
 */
export async function fetchMatchesSincePromise(
  maxFixturesToAnnotate = 8
): Promise<Match[]> {
  const { matches } = await fetchMatchesWithSource(maxFixturesToAnnotate);
  return matches;
}

function filterSincePromise(matches: Match[]): Match[] {
  const sinceMs = PROMISE_DATE.getTime();
  return matches
    .filter((m) => new Date(m.date).getTime() >= sinceMs)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function isApiConfigured(): boolean {
  return Boolean(getApiKey());
}
