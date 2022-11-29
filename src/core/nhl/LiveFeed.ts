import { NHLRest, APIResponse } from "./Rest";

export const fetchFeed = async (gameId: number) => {
    const id = gameId.toString();
    const res = await NHLRest.get(`game/${id}/feed/live`);
    return res;
};