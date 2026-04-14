import type { Match } from "./types";
import { fetchEspnMatchesSincePromise } from "./espn";
import {
  fetchMatchesSincePromise as fetchApiFootballMatches,
  isApiConfigured as isApiFootballConfigured,
} from "./api-football";
import { MOCK_MATCHES } from "./mock-matches";
import { PROMISE_DATE } from "./constants";

export type MatchSource = "espn" | "api-football" | "mock";

export interface MatchesResult {
  matches: Match[];
  source: MatchSource;
  reason?: string;
}

/**
 * Orden de prioridad:
 *   1. ESPN (gratis, sin key, cubre la temporada actual)
 *   2. api-football.com (requiere key; solo útil con plan de pago para 2025/26)
 *   3. Datos mock (último recurso para que la página nunca quede vacía)
 *
 * Cualquier fuente que devuelva un array vacío o un error cae a la siguiente.
 */
export async function fetchMatches(): Promise<MatchesResult> {
  // 1. ESPN
  try {
    const espn = await fetchEspnMatchesSincePromise();
    if (espn && espn.length > 0) {
      return { matches: espn, source: "espn" };
    }
    if (espn && espn.length === 0) {
      // La API respondió pero aún no hay partidos tras la promesa.
      // Pasamos directamente a mocks — no tiene sentido gastar otra petición.
      return {
        matches: filterSincePromise(MOCK_MATCHES),
        source: "mock",
        reason: `ESPN no tiene partidos del Real Madrid desde ${PROMISE_DATE
          .toISOString()
          .slice(0, 10)}`,
      };
    }
    // espn === null => fallo de red, probamos siguiente fuente
  } catch (err) {
    console.error("[matches] ESPN threw", err);
  }

  // 2. api-football.com (si hay key)
  if (isApiFootballConfigured()) {
    try {
      const apf = await fetchApiFootballMatches();
      if (apf.length > 0) {
        return { matches: apf, source: "api-football" };
      }
    } catch (err) {
      console.error("[matches] api-football threw", err);
    }
  }

  // 3. Mocks
  return {
    matches: filterSincePromise(MOCK_MATCHES),
    source: "mock",
    reason: "Ninguna fuente en vivo devolvió partidos",
  };
}

function filterSincePromise(matches: Match[]): Match[] {
  const sinceMs = PROMISE_DATE.getTime();
  return matches
    .filter((m) => new Date(m.date).getTime() >= sinceMs)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
