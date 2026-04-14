import { Match } from "./types";

/**
 * Calcula la racha actual de victorias del Real Madrid SIN penalti a favor.
 * Recibe los partidos en cualquier orden; los ordena por fecha descendente
 * y cuenta desde el más reciente hasta el primero que rompe la regla.
 *
 * Reglas:
 *   - Cualquier empate o derrota rompe la racha.
 *   - Una victoria con penalti a favor también rompe la racha.
 */
export function computeStreak(matches: Match[]): number {
  const sorted = [...matches].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  let streak = 0;
  for (const m of sorted) {
    if (m.result === "W" && !m.penaltyAwardedToRM) {
      streak += 1;
    } else {
      break;
    }
  }
  return streak;
}
