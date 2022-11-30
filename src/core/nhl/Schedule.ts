import { NHLRest, ExpandOptions, APIResponse } from "./Rest";

interface ScheduleMetadata {
    timeStamp: string
}

interface ScheduleDate {
    date: string
    totalItems: number
    totalEvents: number
    totalGames: number
    totalMatches: number
    games: Object[]
}

interface APIGame {
    // WIP
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

/**
 * Checks if there is a game with the specified team for today (or specifed date).
 * @param teamId The team ID to check games for.
 * @param date (Optional) The date to check games for.
 * @returns A promise that returns a boolean specifying if there is a game for today.
 */
export const gameToday = async (teamId: number, date?: Date) : Promise<[gamesToday: boolean, todaysGames: Object[]]> => {
    const res: ScheduleResponse = await NHLRest.get("schedule", {
        teamId,
        expand: [
            ExpandOptions.TEAMS
        ]
    });

    const totalGames = res.totalGames ?? 0;
    const gamesToday = totalGames > 0;
    const todaysGames = res.dates?.[0]?.games;
    return [gamesToday, todaysGames ?? []];
};