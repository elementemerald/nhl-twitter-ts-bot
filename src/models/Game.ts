import { Schedule, APIGame } from "../core/nhl/Schedule";
import { GameTeams } from "../core/nhl/Teams";
import { LiveFeed } from "../core/nhl/LiveFeed";

export enum GameStateCode {
    SCHEDULED = "1",
    PREGAME = "2",
    LIVE = "3",
    LIVE_CRITICAL = "4",
    GAMEOVER = "5",
    CONCLUDED = "6",
    FINAL = "7",
    SCHEDULED_TBD = "8",
    PPD = "9"
};

export enum GameType {
    PRESEASON = "PR",
    REGULAR = "R",
    PLAYOFFS = "P",
    ALLSTAR = "A"
};

export interface GameState {
    abstract: string
    code: GameStateCode
};

export class Game {
    id: number = -1;
    type: GameType = GameType.REGULAR;
    season: string = "";
    dateTime: Date = new Date();
    state: GameState = { abstract: "", code: GameStateCode.CONCLUDED };
    teams?: GameTeams;
    
    /** @internal */
    _rawInfo?: Object;

    private _update(rawInfo: APIGame) {
        // Map API game to class
        this.id = rawInfo.gamePk;
        this.type = rawInfo.gameType as GameType;
        this.season = rawInfo.season;
        this.dateTime = new Date(rawInfo.gameDate);
        this.state = {
            abstract: rawInfo.status.abstractGameState,
            code: rawInfo.status.codedGameState as GameStateCode
        };
        this.teams = rawInfo.teams as GameTeams;

        // Hide the raw info when logged out to prevent confusion
        Object.defineProperty(this, "_rawInfo", {
            enumerable: false,
            value: rawInfo
        });
    }

    constructor(rawInfo: APIGame) {
        this._update(rawInfo);
    }

    public async getFeed() {
        const res = await LiveFeed.fetch(this.id);
        return res;
    }

    public async refresh() {
        const game = await Schedule.fetchGame(this.id);
        if (game) {
            this._update(game);
        }
    }
};