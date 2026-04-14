import type { Match } from "./types";

/**
 * Partidos ficticios del Real Madrid desde la promesa (2026-02-01).
 *
 * Solo se usan como fallback cuando la API no devuelve resultados (p.ej. el
 * plan Free de api-football.com no cubre la temporada 2025/26).
 *
 * Escenario inventado pero verosímil: racha actual de 2 victorias limpias
 * tras una derrota y un empate, con un penalti pitado a favor de por medio.
 */
export const MOCK_MATCHES: Match[] = [
  {
    fixtureId: 900001,
    date: "2026-04-05T20:00:00+00:00",
    competition: "La Liga",
    opponent: "Athletic Club",
    homeAway: "H",
    goalsFor: 3,
    goalsAgainst: 0,
    result: "W",
    penaltyAwardedToRM: false,
    status: "FT",
  },
  {
    fixtureId: 900002,
    date: "2026-03-29T19:00:00+00:00",
    competition: "La Liga",
    opponent: "Sevilla",
    homeAway: "A",
    goalsFor: 2,
    goalsAgainst: 1,
    result: "W",
    penaltyAwardedToRM: false,
    status: "FT",
  },
  {
    fixtureId: 900003,
    date: "2026-03-22T21:00:00+00:00",
    competition: "La Liga",
    opponent: "Atlético Madrid",
    homeAway: "H",
    goalsFor: 1,
    goalsAgainst: 1,
    result: "D",
    penaltyAwardedToRM: false,
    status: "FT",
  },
  {
    fixtureId: 900004,
    date: "2026-03-15T18:30:00+00:00",
    competition: "La Liga",
    opponent: "Villarreal",
    homeAway: "A",
    goalsFor: 2,
    goalsAgainst: 3,
    result: "L",
    penaltyAwardedToRM: false,
    status: "FT",
  },
  {
    fixtureId: 900005,
    date: "2026-03-08T20:00:00+00:00",
    competition: "La Liga",
    opponent: "Real Sociedad",
    homeAway: "H",
    goalsFor: 2,
    goalsAgainst: 0,
    result: "W",
    penaltyAwardedToRM: true,
    status: "FT",
  },
  {
    fixtureId: 900006,
    date: "2026-03-01T21:00:00+00:00",
    competition: "Champions League",
    opponent: "Manchester City",
    homeAway: "A",
    goalsFor: 1,
    goalsAgainst: 2,
    result: "L",
    penaltyAwardedToRM: false,
    status: "FT",
  },
];
