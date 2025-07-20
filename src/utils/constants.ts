export type SportType =
  | "soccer"
  | "basketball"
  | "tennis"
  | "baseball"
  | "football"
  | "hockey";

export interface SportConfig {
  name: string;
  icon: string;
  color: string;
  leagues: string[];
}

export interface BettingOption {
  name: string;
  value: string;
  id: string;
}

export interface Match {
  id: string;
  sport: SportType;
  sportConfig: SportConfig;
  team1: string;
  team2: string;
  startTime: string;
  score: string;
  league: string;
  bettingOptions: Record<string, BettingOption[]>;
  isLive: boolean;
}

export const SPORTS_CONFIG: Record<SportType, SportConfig> = {
  soccer: {
    name: "Soccer",
    icon: "⚽",
    color: "green.400",
    leagues: [
      "Premier League",
      "La Liga",
      "Serie A",
      "Bundesliga",
      "Champions League",
    ],
  },
  basketball: {
    name: "Basketball",
    icon: "🏀",
    color: "orange.400",
    leagues: ["NBA", "EuroLeague", "NCAA", "WNBA"],
  },
  tennis: {
    name: "Tennis",
    icon: "🎾",
    color: "yellow.400",
    leagues: ["ATP", "WTA", "Grand Slam"],
  },
  baseball: {
    name: "Baseball",
    icon: "⚾",
    color: "blue.400",
    leagues: ["MLB", "World Series"],
  },
  football: {
    name: "American Football",
    icon: "🏈",
    color: "purple.400",
    leagues: ["NFL", "NCAA Football"],
  },
  hockey: {
    name: "Hockey",
    icon: "🏒",
    color: "cyan.400",
    leagues: ["NHL", "KHL"],
  },
} as const;

export const BETTING_OPTIONS: Record<string, string[]> = {
  "1X2": ["1", "X", "2"],
  "Double Chance": ["1X", "12", "X2"],
  Total: ["Over 2.5", "Under 2.5"],
  "Both Teams Score": ["Yes", "No"],
} as const;

export const UPDATE_INTERVAL = 2000; // 2 seconds
export const HIGHLIGHT_DURATION = 1000; // 1 second
export const ROW_HEIGHT = 80;
export const TOTAL_MATCHES = 10000;
