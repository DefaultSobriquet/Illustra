import { Message} from "discord.js";
import { ICommandContext } from "../types";
// import IllustraClient from "./IllustraClient";
// import Module from "./Module";

export class Command{
    
    name: string;
    aliases: string[]; 
    userPerms: string[];
    botPerms: string[];
    module: string /*Module goes here later.*/;
    description: string;
    usage: string; 
    examples: string[];
    enabled: boolean;
    guildOnly: boolean;
    dev: boolean;

    constructor(options: Partial<Command>){
        this.aliases = options.aliases ?? [];
        this.userPerms = options.userPerms ?? [];
        this.botPerms = options.botPerms ?? [];
        this.name = options.name ?? "test";
        this.module = options.module ?? "System" /* new Module() */;
        this.description = options.description ?? "What can this do?";
        this.usage = options.usage ?? "[user]";
        this.examples = options.examples ?? [];
        this.enabled = true;
        this.dev = false;
        this.guildOnly = true;
    }

    async execute(ctx: ICommandContext, client: any /* IllustraClient goes here later.*/): Promise<any|void>{
        new Error("You didn't make me something!");
    }
    
}