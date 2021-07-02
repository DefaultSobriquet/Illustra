import { ICommandContext } from "../types";
import { Collection, PermissionString } from "discord.js";
import IllustraClient from "./IllustraClient";
import { CommandResponse } from "./CommandResponse";
import { Flag } from "./Flag";
import Module from "./Module";

export class Command{
    
    parent?: Command;
    module?: Module;
    name: string;
    aliases: string[];
    userPerms: PermissionString[];
    botPerms: PermissionString[];
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
        this.name = options.name ?? "sample";
        this.description = options.description ?? "What can this do?";
        this.usage = options.usage ?? "[user]";
        this.examples = options.examples ?? [];
        this.enabled = options.enabled ?? true;
        this.devOnly = options.devOnly ?? false;
        this.guildOnly = options.guildOnly ?? true;
        this.reqArgs = options.reqArgs ?? 0;
        this.cooldownTime = options.cooldownTime ?? 2000;
        this._cooldowns = new Collection();
        this.subcommands = new Collection();
        this.flags = new Collection();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<CommandResponse> {
        throw new Error("You didn't make me do something!");
    }

    setCooldown(ctx: ICommandContext): void {
        this._cooldowns.set(ctx.user.id, Date.now());
    }
    
    checkCooldown(ctx: ICommandContext): number {
        const cooldown = this._cooldowns.get(ctx.user.id);
        if(!cooldown || Date.now()-cooldown >= this.cooldownTime){
            this._cooldowns.delete(ctx.user.id);
            return 0;
        }
        return Date.now()-cooldown;
    }

    disable(): void {
        this.enabled = false;
    }

    enable(): void {
        this.enabled = true;
    }

}