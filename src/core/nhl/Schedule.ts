import { NHLRest, ExpandOptions, APIResponse } from "./Rest";
import { GameTeams } from "./Teams";

interface ScheduleMetadata {
    timeStamp: string
}

interface ScheduleDate {
    date: string
    totalItems: number
    totalEvents: number
    totalGames: number
    totalMatches: number
    games: APIGame[]
}

export interface APIGame {
    gamePk: number
    gameType: string
    season: string
    gameDate: string
    status: APIGameStatus
    teams: GameTeams
}

export interface APIGameStatus {
    abstractGameState: string
    codedGameState: string
    detailedState: string
    statusCode: string
    startTimeTBD: boolean
}

interface ScheduleResponse extends APIResponse {
    totalItems?: number
    totalEvents?: number
    totalGames?: number
    totalMatches?: number
    metaData?: ScheduleMetadata
    wait?: number
    dates?: ScheduleDate[]
}

export class Schedule {
    /**
     * Fetches games with the specified team for today (or specifed date).
     * @param teamId The team ID to check games for.
     * @param date (Optional) The date to check games for.
     * @returns A promise that returns games for today for the specified team.
     */
    static async fetchGames(teamId: number, date?: Date) {
        const res: ScheduleResponse = await NHLRest.get("schedule", {
            teamId,
            expand: [
                ExpandOptions.TEAMS
            ]
        });
    
        const todaysGames = res.dates?.[0]?.games ?? [];
        return todaysGames;
    }

    /**
     * Fetch a game with the specified game ID.
     * @param gameId The game ID to fetch.
     * @returns A promise that returns the game from the game ID or undefined if the game is unknown.
     */
    static async fetchGame(gameId: number) {
        const res: ScheduleResponse = await NHLRest.get("schedule", {
            gamePk: gameId,
            expand: [
                ExpandOptions.TEAMS
            ]
        });

        return res.dates?.[0]?.games[0];
    }
}
