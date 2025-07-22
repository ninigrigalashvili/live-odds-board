import {
  SPORTS_CONFIG,
  BETTING_OPTIONS,
  type SportType,
  type Match,
  type BettingOption,
} from "@/utils/constants";

/**
 * Pool of team/player names used for generating realistic match-ups
 * Includes teams from various sports and famous athletes
 */
const TEAMS = [
  // Soccer teams
  "Manchester United",
  "Liverpool",
  "Barcelona",
  "Real Madrid",
  "Bayern Munich",
  "PSG",
  "Juventus",
  "AC Milan",
  "Chelsea",
  "Arsenal",
  "Tottenham",
  "Manchester City",
  "Atletico Madrid",
  "Valencia",
  "Sevilla",
  "Borussia Dortmund",
  "Inter Milan",
  "Napoli",
  "Roma",
  "Lazio",
  "Ajax",
  "Benfica",
  "Porto",
  "Celtic",
  "Rangers",

  // Basketball teams
  "Lakers",
  "Warriors",
  "Celtics",
  "Heat",
  "Spurs",
  "Nets",
  "Knicks",
  "Bulls",
  "Clippers",
  "Nuggets",
  "Bucks",
  "Suns",
  "Mavericks",
  "Rockets",
  "Jazz",
  "Blazers",

  // Tennis players
  "Federer",
  "Nadal",
  "Djokovic",
  "Murray",
  "Tsitsipas",
  "Zverev",
  "Medvedev",
  "Thiem",
  "Berrettini",
  "Hurkacz",
  "Serena Williams",
  "Osaka",
  "Barty",
  "Halep",

  // Baseball teams
  "Yankees",
  "Red Sox",
  "Dodgers",
  "Giants",
  "Cubs",
  "Cardinals",
  "Mets",
  "Phillies",

  // American Football teams
  "Patriots",
  "Chiefs",
  "Cowboys",
  "Packers",
  "Steelers",
  "Ravens",
  "Saints",
  "Seahawks",

  // Hockey teams
  "Bruins",
  "Rangers",
  "Flyers",
  "Penguins",
  "Blackhawks",
  "Red Wings",
  "Maple Leafs",
];

/**
 * Generates random betting odds for a single option
 * @returns Partial betting option object without the name property
 */
const generateRandomOdds = (
  matchIndex: number,
  category: string,
  optionName: string
): Omit<BettingOption, "name"> => ({
  value: (Math.random() * 4 + 1).toFixed(2), // Random odds between 1.00 and 5.00
  id: `match-${matchIndex}-${category}-${optionName}`,
});

/**
 * Creates betting options for all available markets
 * Generates realistic odds for each betting choice in each market
 * @returns Complete betting options object with all markets and odds
 */

const generateBettingOptions = (
  matchIndex: number
): Record<string, BettingOption[]> => {
  const options: Record<string, BettingOption[]> = {};
  Object.entries(BETTING_OPTIONS).forEach(([category, choices]) => {
    options[category] = choices.map((choice) => ({
      name: choice,
      ...generateRandomOdds(matchIndex, category, choice),
    }));
  });
  return options;
};
/**
 * Generates a realistic current score for a match
 * Creates random scores that look believable for different sports
 * @returns Formatted score string (e.g., "2 - 1", "0 - 0")
 */
const generateRandomScore = () => {
  const score1 = Math.floor(Math.random() * 5);
  const score2 = Math.floor(Math.random() * 5);
  return `${score1} - ${score2}`;
};

/**
 * Generates a realistic match start time
 * Creates times within a 3-hour window around the current time
 * @returns Formatted time string (e.g., "14:30", "16:45")
 */
const generateStartTime = () => {
  const now = new Date();
  const randomMinutes = Math.floor(Math.random() * 180) - 90; // -90 to +90 minutes
  const startTime = new Date(now.getTime() + randomMinutes * 60000);

  // Format as HH:MM
  return startTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Main function to generate mock matches for the application
 * Creates a specified number of realistic matches with random data
 *
 * @param count - Number of matches to generate (default: 10,000)
 * @returns Array of complete match objects ready for display
 */
export const generateMockMatches = (count: number = 10000): Match[] => {
  const matches: Match[] = [];
  const sports = Object.keys(SPORTS_CONFIG) as SportType[];

  for (let i = 0; i < count; i++) {
    const sport = sports[Math.floor(Math.random() * sports.length)];
    const sportConfig = SPORTS_CONFIG[sport];
    const team1 = TEAMS[Math.floor(Math.random() * TEAMS.length)];
    let team2 = TEAMS[Math.floor(Math.random() * TEAMS.length)];

    // Ensure different teams
    while (team2 === team1) {
      team2 = TEAMS[Math.floor(Math.random() * TEAMS.length)];
    }

    matches.push({
      id: `match-${i}`, // Use index instead of UUID
      sport,
      sportConfig,
      team1,
      team2,
      startTime: generateStartTime(),
      score: generateRandomScore(),
      league:
        sportConfig.leagues[
          Math.floor(Math.random() * sportConfig.leagues.length)
        ],
      bettingOptions: generateBettingOptions(i),
      isLive: Math.random() > 0.3, // 70% chance of being live
    });
  }

  return matches;
};
