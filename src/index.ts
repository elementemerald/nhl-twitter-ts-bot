import { config } from "dotenv";
config();

import { Client } from "./core/twitter";
import { delay, Logger, LogColor } from "./core/utils";
import { LiveFeedData, LiveFeedPlay } from "./core/nhl/LiveFeed";
import { Team } from "./models/Team";
import { Game, GameStateCode } from "./models/Game";

//import { isEqual } from "lodash";
let cacheInit = false;
let playCache: string[] = [];

const feedLog = new Logger("Main/GameFeed", LogColor.FGRED);
const feedLoop = async (feed: LiveFeedData) => {
    const allPlays = feed.plays.allPlays;
    const latestPlay = allPlays[allPlays.length - 1];

    if (cacheInit) {
        const playsFiltered = allPlays.filter(play => !playCache.some(id => play.result.eventCode === id));

        if (playsFiltered.length > 0) {
            for (const play of playsFiltered) {
                feedLog.log(play.result.description);
                playCache.push(play.result.eventCode);
            }
        } else {
            feedLog.log(LogColor.DIM + "No changes" + LogColor.RESET);
        }
    } else {
        for (let i = 0; i < allPlays.length; i++) {
            const play = allPlays[i];
            if (i === (allPlays.length - 1)) {
                // Construct latest event
                feedLog.log(latestPlay.result.description);
            }
            playCache.push(play.result.eventCode);
            cacheInit = true;
        }
    }

    console.log(latestPlay);
};

const gameLoop = async (game: Game, team: Team) => {
    const glLog = new Logger("Main/Game", LogColor.FGYELLOW);
    const isHome = game.teams?.home.team.id === team.id;

    let initPrefScore = isHome
        ? game.teams?.home.score as number
        : game.teams?.away.score as number;
    let initOtherScore = isHome
        ? game.teams?.away.score as number
        : game.teams?.home.score as number;

    while (true) {
        await game.refresh();
        const now = new Date();

        switch (game.state?.code) {
            case GameStateCode.SCHEDULED:
            case GameStateCode.SCHEDULED_TBD:
                glLog.log("Starting pregame wait", now);

                // @ts-ignore
                const diff = Math.abs(game.dateTime - now);
                let diffSeconds = Math.ceil(diff / 1000);

                //console.log("Game is scheduled at", game.dateTime.toLocaleString("en-US"));
                for (let i = diffSeconds; i > 0; i -= 60) {
                    diffSeconds = i;
                    glLog.log(diffSeconds);
                    glLog.log("Waiting another minute until pregame");
                    await delay(60000);
                }
            case GameStateCode.PREGAME:
                glLog.log("Pregame - waiting until puck drop, currently", now.toLocaleTimeString("en-US"));
                await delay(30000);
            case GameStateCode.LIVE:
            case GameStateCode.LIVE_CRITICAL:
            {
                glLog.log("Game is LIVE - checking for changes");

                // Goal removed? (Challenge)
                const teamScore = isHome
                    ? game.teams?.home.score as number
                    : game.teams?.away.score as number;
                const teamScoreRemoved = teamScore < initPrefScore;
                const otherScore = isHome
                    ? game.teams?.away.score as number
                    : game.teams?.home.score as number;
                const otherScoreRemoved = otherScore < initOtherScore;

                if (teamScoreRemoved || otherScoreRemoved) {
                    // Goal was removed
                }

                initPrefScore = teamScore;
                initOtherScore = otherScore;
                const feed = await game.getFeed();
                if (feed.liveData) await feedLoop(feed.liveData);
            }
            case GameStateCode.GAMEOVER:
            case GameStateCode.CONCLUDED:
            case GameStateCode.FINAL:
            {
                cacheInit = false;
                playCache.splice(0, playCache.length);
            }
            case GameStateCode.PPD:
                break;
        }
        await delay(4000);
    }
};

const run = async () => {
    const mainLog = new Logger("Main", LogColor.FGBLUE);
    mainLog.log("Initializing");

    /* const twitter = new Client({
        apiKey: process.env.APP_ID as string,
        apiSecret: process.env.APP_SECRET as string,
        accessToken: process.env.ACCESS_TOKEN as string,
        accessTokenSecret: process.env.ACCESS_SECRET as string
    }); */
    const teamShort = process.env.NHL_TEAM || "EDM";
    const team = await Team.createFromShort(teamShort);
    if (team) {
        let games = await team.fetchGames();

        for (const game of games) {
            mainLog.log("Found game:", `${game.teams?.away.team.name} vs. ${game.teams?.home.team.name}`);
            await gameLoop(game, team);
            games.shift();
        }
    }
};

run();