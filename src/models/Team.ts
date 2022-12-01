import { Logger, LogColor } from "../core/utils";
import { Schedule, Teams } from "../core/nhl";
import { Game } from "./Game";

export class Team {
    id: number;
    name?: string;
    short?: string;

    constructor(id: number, name?: string, short?: string) {
        this.id = id;
        this.name = name;
        this.short = short;
    }

    /**
     * Fetches games with this team for today (or specifed date).
     * @param date (Optional) The date to check games for.
     * @returns A promise that returns games for today for this team.
     */
    public async fetchGames(date?: Date) : Promise<Game[]> {
        const fetchLog = new Logger("Team/Games", LogColor.FGGREEN);
        fetchLog.log("Fetching games for team:", this.name ?? "N/A", `(${this.short ?? "?"})`);

        const games = await Schedule.fetchGames(this.id, date);

        // Mapping
        const botGames: Game[] = [];
        for (const game of games) {
            const mapped = new Game(game);
            botGames.push(mapped);
        }

        return botGames;
    }

    static async createFromShort(short: string) {
        const teamCreateLog = new Logger("Team/Create", LogColor.FGMAGENTA);

        return new Promise((
            resolve: (value: Team) => void,
            reject: (reason?: Error) => void
        ) => {
            Teams.getAll()
                .then(teams => {
                    const team = teams.find(team => team.abbreviation === short);
                    if (!team) reject(new Error("Team unknown"));
                    const initTeam = new Team(
                        team?.id ?? -1,
                        team?.name,
                        team?.abbreviation
                    );
                    teamCreateLog.log("Found team:", initTeam.name ?? "N/A", `(${initTeam.short ?? "?"})`);
                    resolve(initTeam);
                })
                .catch((err: Error) => {
                    reject(err);
                });
        })
    }
};
