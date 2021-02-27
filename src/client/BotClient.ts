import { AkairoClient, CommandHandler, ListenerHandler } from "discord-akairo";
import { User, Message } from "discord.js"
import { join } from "path";
import { owners, prefix } from "../config";

declare module "discord-akairo"{
    export interface AkairoClient {
        commandHandler: CommandHandler,
        listenerHandler: ListenerHandler
    }
}
export interface BotOptions {
    token?: string;
    owners?: string | string[]|undefined;
}
export default class BotClient extends AkairoClient {

    config: BotOptions;
    public listenerHandler: ListenerHandler = new ListenerHandler(this, {
        directory: join(__dirname, "..", 'listeners')

    });
    public commandHandler: CommandHandler = new CommandHandler(this,
        {

            directory: join(__dirname, '..', 'commands'),
            prefix: prefix,
            allowMention: true,
            handleEdits: true,
            commandUtil: true,
            commandUtilLifetime: 3e5,
            defaultCooldown: 6e4,
            argumentDefaults: {
                prompt: {
                    modifyStart: (_: Message, str: string): string => `${str}\n\nType 'cancel' to cancel the command... `,
                    modifyRetry: (_: Message, str: string): string => `${str}\n\n Type 'cancel' to cancel the command...`,
                    timeout: 'You took too long, the command has been cancelled',
                    ended: 'You exceeded the maximum amount of tries, this command has now been cancelled...',
                    cancel: 'this command has been cancelled',
                    retries: 3,
                    time: 3e4
                },
                otherwise: ""
            },
            ignorePermissions: owners
    });
    public constructor(config: BotOptions) {
        super({
            ownerID: config.owners
        });
        this.config = config;
    }
    private async _init(): Promise<void>{
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.listenerHandler.setEmitters({
            commandHandler:this.commandHandler,
            listenerHandler:this.listenerHandler,
            process
        })
        this.commandHandler.loadAll();
        this.listenerHandler.loadAll();
    }

    public async start(): Promise<string>{
        await this._init();
        return this.login(this.config.token);
    }

}



