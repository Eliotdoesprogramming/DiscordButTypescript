import BotClient from "./client/BotClient";
import {token,owners} from "./config";


const client:BotClient = new BotClient({
    token: token,
    owners:owners
});
client.start();