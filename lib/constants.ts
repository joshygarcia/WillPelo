// Fecha en la que Will hizo la promesa de no cortarse el pelo
// hasta que el Real Madrid gane 5 partidos seguidos sin penalti a favor.
export const PROMISE_DATE = new Date("2026-02-01T00:00:00Z");

// Fecha en la que Will ABANDONÓ el reto: se cortó el pelo (terminando el
// reto) y se lo tiñó de rubio por otra apuesta. Día 128 desde la promesa.
export const ABANDON_DATE = new Date("2026-06-09T00:00:00Z");

// Días que aguantó Will antes de rendirse (récord final, ya congelado).
export const FINAL_DAYS = Math.floor(
  (ABANDON_DATE.getTime() - PROMISE_DATE.getTime()) / 86_400_000
);

// El reto terminó: ya no es un contador en vivo.
export const RETO_ABANDONADO = true;

// ID del Real Madrid en api-football.com
export const RM_TEAM_ID = 541;

// ID del Real Madrid en la API pública de ESPN (site.api.espn.com)
export const RM_TEAM_ID_ESPN = 86;

// Escudo oficial del Real Madrid servido por ESPN (PNG 500×500)
export const RM_LOGO_URL = "https://a.espncdn.com/i/teamlogos/soccer/500/86.png";

// Objetivo de la racha
export const STREAK_GOAL = 5;

// Temporada actual en api-football (usa el año de inicio de temporada)
export const CURRENT_SEASON = 2025;
