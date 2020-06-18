import { Client, Guild} from "discord.js";
import { IUtilsOptions } from "../types";

class RoleUtils{
	client: Client;
	constructor(options: IUtilsOptions){
		this.client = options.client;
	}
	resolve = (input: string, guild: Guild) => {
		if (!input) return null;
		let role = guild.roles.cache.find((role) => role.id === input);
		role = role ?? guild.roles.cache.find((role) => role.toString() === input);
		role = role ?? guild.roles.cache.find((role) => role.name === input)
		role = role ?? guild.roles.cache.find((role) => role.name.startsWith(input));
		role = role ?? guild.roles.cache.find((role) => role.name.toLowerCase().startsWith(input.toLowerCase()));
		return role;
	}
};

export default RoleUtils;
