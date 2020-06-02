import { Message } from "discord.js";

export class Command{
	
	aliases: string[];
	perms: string[];
	requires: string[];
	name: string;
	category: string;
	description: string;
	usage: string;
	example: string;
	flags: string[]

	constructor(options: Partial<Command>){
		this.aliases = options.aliases ?? [];
		this.perms = options.perms ?? [];
		this.requires = options.requires ?? [];
		this.name = options.name ?? "test";
		this.category = options.category ?? "System";
		this.description = options.description ?? "What can this do?";
		this.usage = options.usage ?? "test [target]";
		this.example = options.example ?? "test me";
		this.flags = options.flags ?? [];
	}

	async execute(client: any, message: Message, args: string[], flags: string[]): Promise<any|void>{
		new Error("You didn't make me something!");
	}
}