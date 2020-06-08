import { Message } from "discord.js";
// import IllustraClient from "./IllustraClient";
import { Flag } from "./Flag";
// import Module from "./Module";

export class Command{
    
    aliases: string[];
    userPerms: string[];
    botPerms: string[];
    name: string;
    module: string/*Module goes here later.*/;
    description: string;
    usage: string;
    example: string;
    flags: Flag[]

    constructor(options: Partial<Command>){
        this.aliases = options.aliases ?? [];
        this.userPerms = options.userPerms ?? [];
        this.botPerms = options.botPerms ?? [];
        this.name = options.name ?? "test";
        this.module = options.module ?? "System" /* new Module() */;
        this.description = options.description ?? "What can this do?";
        this.usage = options.usage ?? "test [target]";
        this.example = options.example ?? "test me";
        this.flags = options.flags ?? [];
    }

    async execute(client: any /* IllustraClient goes here later.*/, message: Message, args: string[], flags: Flag[]): Promise<any|void>{
        new Error("You didn't make me something!");
    }
}