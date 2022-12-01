import { TwitterClient } from "twitter-api-client";
import IClientOptions from "twitter-api-client/dist/base/IClientOptions";
import { fileTypeFromBuffer } from "file-type";

export class Client {
    tClient: TwitterClient;

    constructor(options: IClientOptions) {
        this.tClient = new TwitterClient(options);
    }
}