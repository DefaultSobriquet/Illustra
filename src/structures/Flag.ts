import { Command } from "./Command";

export class Flag{
	name: string;
	aliases: string[];
	usage: string;
	example: string;
	description: string;
	command: Command;
	constructor(options: Partial<Flag>){
	  this.name = options.name ?? "test";
	  this.description = options.description ?? "This runs a test.";
	  this.aliases = options.aliases ?? [];
	  this.usage = options.usage ?? "test";
	  this.example = options.usage ?? "test";
	  this.command = options.command ?? new Command({});
	}
}