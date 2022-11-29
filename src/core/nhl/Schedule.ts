import { NHLRest, ExpandOptions, APIResponse } from "./Rest";

interface ScheduleMetadata {
    timeStamp: string
}

interface ScheduleResponse extends APIResponse {
    totalItems?: number
    totalEvents?: number
    totalGames?: number
    totalMatches?: number
    metaData?: ScheduleMetadata
    wait?: number
    dates?: Object[]
}

/**
 * Checks if there is a game with the specified team for today (or specifed date).
 * @param teamId The team ID to check games for.
 * @param date (Optional) The date to check games for.
 * @returns A promise that returns a boolean specifying if there is a game for today.
 */
export const gameToday = async (teamId: number, date?: Date) => {
    const res: ScheduleResponse = await NHLRest.get("schedule", {
        teamId,
        expand: [
            ExpandOptions.TEAMS
        ]
    });

    const totalGames = res.totalGames ?? 0;
    return totalGames > 0;
};