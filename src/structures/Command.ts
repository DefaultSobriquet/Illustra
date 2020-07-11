import { ICommandContext } from "../types";
import { Collection, PermissionString } from "discord.js";
import IllustraClient from "./IllustraClient";
import { CommandResponse } from "./CommandResponse";
import { Flag } from "./Flag";
// import Module from "./Module";

export class Command{
    
    parent?: Command;
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
    cooldownTime: number;
    _cooldowns: Collection<string, number>;
    subcommands: Collection<string, Command>;
    flags: Collection<string, Flag>;

    constructor(options: Partial<Command>){
        this.parent = options.parent;
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
        this.cooldownTime = options.cooldownTime ?? 2000;
        this._cooldowns = new Collection();
        this.subcommands = options.subcommands ?? new Collection();
        this.flags = new Collection();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<CommandResponse> {
        throw new Error("You didn't make me do something!");
    }

    setCooldown(ctx: ICommandContext): void {
        this._cooldowns.set(ctx.user.id, Date.now());
    }
    
    checkCooldown(ctx: ICommandContext): boolean {
        const cooldown = this._cooldowns.get(ctx.user.id);
        if(!cooldown || Date.now()-cooldown >= this.cooldownTime){
            this._cooldowns.delete(ctx.user.id);
            return true;
        }
        return false;
    }

}