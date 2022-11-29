import { NHLRest, APIResponse } from "./Rest";

interface APITeam {
    id: number
    name: string
    abbreviation: string
}

interface AllTeamsResponse extends APIResponse {
    teams?: APITeam[]
}

/**
 * Gets all teams from the NHL API.
 * @returns An array of all NHL teams.
 */
export const getAll = async () => {
    const res: AllTeamsResponse = await NHLRest.get("teams");
    return res.teams ?? [];
};