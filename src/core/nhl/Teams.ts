import { NHLRest, APIResponse } from "./Rest";

export interface GameTeams {
    home: GameTeam
    away: GameTeam
}

export interface GameTeam {
    score: number
    team: APITeam
}

export interface APITeam {
    id: number
    name: string
    abbreviation: string
}

interface AllTeamsResponse extends APIResponse {
    teams?: APITeam[]
}

export class Teams {
    /**
     * Gets all teams from the NHL API.
     * @returns An array of all NHL teams.
     */
    static async getAll() {
        const res: AllTeamsResponse = await NHLRest.get("teams");
        return res.teams ?? [];
    }
}
