import { ICommandContext } from "../types";
import { Collection, PermissionString } from "discord.js";
import IllustraClient from "./IllustraClient";
// import IllustraClient from "./IllustraClient";
// import Module from "./Module";

export class Command{
    
    name: string;
    aliases: string[];
    userPerms: PermissionString[];
    botPerms: PermissionString[];
    module: string /*Module goes here later.*/;
    description: string;
    usage: string; 
    examples: string[];
    enabled: boolean;
    guildOnly: boolean;
    devOnly: boolean;
    reqArgs: number;
    subcommands: Collection<string, Command>

    constructor(options: Partial<Command>){
        this.aliases = options.aliases ?? [];
        this.userPerms = options.userPerms ?? [];
        this.botPerms = options.botPerms ?? [];
        this.name = options.name ?? "test";
        this.module = options.module ?? "System" /* new Module() */;
        this.description = options.description ?? "What can this do?";
        this.usage = options.usage ?? "[user]";
        this.examples = options.examples ?? [];
        this.enabled = options.enabled ?? true;
        this.devOnly = options.devOnly ?? false;
        this.guildOnly = options.guildOnly ?? true;
        this.reqArgs = options.reqArgs ?? 0;
        this.subcommands = options.subcommands ?? new Collection();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<void>{
        new Error("You didn't make me something!");
    }
    
}