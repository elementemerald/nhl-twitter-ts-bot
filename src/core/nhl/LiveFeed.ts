import Rest, { APIResponse } from "./Rest";

export const fetchFeed = async (gameId: number) => {
    const id = gameId.toString();
    const res = await Rest.get(`game/${id}/feed/live`);
    return res;
};