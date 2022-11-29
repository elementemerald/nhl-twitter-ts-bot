import { config } from "dotenv";
config();

import { TwitterClient } from "twitter-api-client";
import { Team } from "./models/Team";

const twitterClient = new TwitterClient({
    apiKey: process.env.APP_ID as string,
    apiSecret: process.env.APP_SECRET as string,
    accessToken: process.env.ACCESS_TOKEN,
    accessTokenSecret: process.env.ACCESS_SECRET
});

const run = async () => {
    const teamShort = process.env.NHL_TEAM || "EDM";

    // Start processing
    const team = await Team.createFromShort(teamShort);
    console.log(team);
};

run();