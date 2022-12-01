import { Logger, LogColor } from "../utils";
import { stringify } from "qs";
import nodeFetch, { RequestInit } from "node-fetch";

const restLog = new Logger("Rest/Debug", LogColor.BGMAGENTA);
const restDebug = Boolean(process.env.DEBUG || false);

const baseUrl = "https://statsapi.web.nhl.com/api/v1/";

enum CommonEndpoints {
    SCHEDULE = "schedule",
    TEAMS = "teams"
}

export enum ExpandOptions {
    BROADCASTS_ALL = "schedule.broadcasts.all",
    TEAMS = "schedule.teams",
    LINESCORE = "schedule.linescore",
    SERIES = "schedule.game.seriesSummary",
    TICKET = "schedule.ticket",
    EPG = "schedule.game.content.media.epg"
};

interface EndpointOptions {
    gamePk?: number
    teamId?: number
    startDate?: Date
    endDate?: Date
    expand?: ExpandOptions[]
}

export interface APIResponse {
    copyright?: string
}

export class NHLRest {
    /**
     * Fetches an endpoint from the NHL API.
     * @param endpoint The endpoint to fetch.
     * @param options The options for this request.
     * @param timeout The number of milliseconds to wait for a response before erroring.
     * @param init Internal request options
     * @returns 
     */
    static async get(endpoint: CommonEndpoints | string, options?: EndpointOptions, timeout?: number, init?: RequestInit) : Promise<APIResponse> {
        const params = stringify(options, {
            addQueryPrefix: true,
            filter: (prefix, value) => {
                if (value instanceof Date) {
                    return value.toISOString().split("T")[0];
                }
    
                if (options?.expand && value === options?.expand) {
                    return options.expand.join(",");
                }
    
                return value;
            }
        });
    
        const url = `${baseUrl + endpoint}${params}`;
        if (restDebug) restLog.log(url);
    
        return new Promise((resolve, reject) => {
            let timedOut = false;
            let reqTimeout = setTimeout(() => {
                timedOut = true;
                throw new Error("Timeout");
            }, timeout ?? (10 * 1000));
    
            nodeFetch(url, init)
                .then(res => {
                    clearTimeout(reqTimeout);
                    if (res.ok) {
                        return res.json();
                    } else {
                        reject(new Error(res.statusText));
                    }
                })
                .then((json: APIResponse) => {
                    resolve(json);
                });
        });
    };
};
