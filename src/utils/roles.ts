import { Client, Guild, Role} from "discord.js";
import { IUtilsOptions } from "../types";

class RoleUtils{
	client: Client;
	constructor(options: IUtilsOptions){
		this.client = options.client;
	}
	resolve = (input: string, guild: Guild): (Role|undefined) => {
		if (!input) return undefined;
		let role = guild.roles.cache.find((role) => role.id === input);
		role = role ?? guild.roles.cache.find((role) => role.toString() === input);
		role = role ?? guild.roles.cache.find((role) => role.name === input);
		role = role ?? guild.roles.cache.find((role) => role.name.startsWith(input));
		role = role ?? guild.roles.cache.find((role) => role.name.toLowerCase().startsWith(input.toLowerCase()));
		return role;
	}
}

export default RoleUtils;
