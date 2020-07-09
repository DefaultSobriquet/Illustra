import { Client } from "discord.js";
import { IUtilsOptions } from "../types";
import EmoteUtils from "./emotes";
import RoleUtils from "./roles";
import UserUtils from "./users";

class Utils{
	client: Client;
	emote: EmoteUtils;
	role: RoleUtils;
	user: UserUtils;
	constructor(options: IUtilsOptions){
		this.client = options.client;
		this.emote = new EmoteUtils(options);
		this.role = new RoleUtils(options);
		this.user = new UserUtils(options);
	}
	/**
	 * Processes the result of an eval and removes any tokens or breaking markdown
	 * @param {any} input The result of an eval
	 * @returns {string} A cleaned string representation of the result
	 */
	clean(input: any): string{
		if (typeof (input) !== "string") {
			input = require("util").inspect(input, {
				depth: 0
			});
		}

		input = input
			.replace(/`/g, "`" + String.fromCharCode(8203))
			.replace(/@/g, "@" + String.fromCharCode(8203))
			.replace(this.client.token!, "TOKEN");
		
		return input;
	}
}

export default Utils;