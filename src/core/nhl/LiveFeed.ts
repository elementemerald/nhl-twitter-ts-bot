import { NHLRest, APIResponse } from "./Rest";

export interface LiveFeedData {
    plays: LiveFeedPlays
}

export interface LiveFeedPlays {
    allPlays: LiveFeedPlay[]
    currentPlay: LiveFeedPlay
}

export interface LiveFeedPlay {
    result: LiveFeedPlayResult
    about: LiveFeedPlayAbout
}

export interface LiveFeedPlayResult {
    event: string
    eventCode: string
    description: string
}

export interface LiveFeedPlayAbout {
    eventIdx: number
    eventId: number
}

export interface LiveFeedResponse extends APIResponse {
    liveData?: LiveFeedData
}

export class LiveFeed {
    static async fetch(gameId: number) {
        const random = Math.random() * (9000 - 1000) + 1000;

        const id = gameId.toString();
        const res: LiveFeedResponse = await NHLRest.get(`game/${id}/feed/live${random}`);
        return res;
    }
}
