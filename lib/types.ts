export type Result = "W" | "D" | "L";

export interface Match {
  fixtureId: number;
  date: string; // ISO
  competition: string;
  opponent: string;
  opponentLogo?: string;
  homeAway: "H" | "A";
  goalsFor: number;
  goalsAgainst: number;
  result: Result;
  penaltyAwardedToRM: boolean;
  status: string;
}

// --- Subset of api-football response shapes we actually use ---

export interface ApfFixturesResponse {
  response: ApfFixtureItem[];
  errors?: unknown;
}

export interface ApfFixtureItem {
  fixture: {
    id: number;
    date: string;
    status: { short: string; long: string };
  };
  league: { id: number; name: string; season: number };
  teams: {
    home: { id: number; name: string };
    away: { id: number; name: string };
  };
  goals: { home: number | null; away: number | null };
}

export interface ApfEventsResponse {
  response: ApfEventItem[];
  errors?: unknown;
}

export interface ApfEventItem {
  team: { id: number; name: string };
  type: string; // "Goal" | "Card" | "subst" | "Var" | ...
  detail: string; // "Normal Goal" | "Penalty" | "Missed Penalty" | "Penalty awarded" | ...
  time: { elapsed: number; extra: number | null };
}
