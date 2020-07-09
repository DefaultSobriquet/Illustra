import { IFlagOptions, IFlagData } from "../types";
import { Command } from "./Command";

export class Flag{
	name: string;
	description: string;
	hasValue: boolean;
	usage: string;
	example: string;
	constructor(options: IFlagOptions){
		this.name = options.name;
		this.description = options.description;
		this.hasValue = options.hasValue ?? false;
		this.usage = options.usage ?? "";
		this.example = options.example ?? "";
	}
	static parseFlags(flags: string[], cmd: Command){
		let parsedFlags: IFlagData = {};

		for(const flag of flags){
			const [name, arg] = flag.replace("--", "").split("=");

			if(cmd.flags.has(name.toLowerCase())) parsedFlags[name.toLowerCase()] = arg ?? "";
		}

		return parsedFlags;
	}
}