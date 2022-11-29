enum GameStateCode {
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

enum GameType {
    PRESEASON = "PR",
    REGULAR = "R",
    PLAYOFFS = "P",
    ALLSTAR = "A"
};

interface GameState {
    abstractGameState: string
    codedGameState: GameStateCode
}

interface GameInfo {
    id: number
    type: GameType
    season: string
    dateTime: Date
    state: GameState
};

export class Game {
    info: GameInfo;

    constructor(info: GameInfo) {
        this.info = info;
    }
};