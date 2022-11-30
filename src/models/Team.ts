import { getAll } from "../core/nhl/Teams";

export class Team {
    id: number;
    name?: string;
    short?: string;

    constructor(id: number, name?: string, short?: string) {
        this.id = id;
        this.name = name;
        this.short = short;
    }

    public getId() {
        return this.id;
    }

    static async createFromShort(short: string) {
        return new Promise((
            resolve: (value: Team) => void,
            reject: (reason?: Error) => void
        ) => {
            getAll()
                .then(teams => {
                    const team = teams.find(team => team.abbreviation === short);
                    if (!team) reject(new Error("Team unknown"));
                    const initTeam = new Team(
                        team?.id ?? -1,
                        team?.name,
                        team?.abbreviation
                    );
                    resolve(initTeam);
                })
                .catch((err: Error) => {
                    reject(err);
                });
        })
    }
};
