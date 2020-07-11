import { Client } from "discord.js";
import { IUtilsOptions } from "../types";
import EmoteUtils from "./emotes";
import RoleUtils from "./roles";
import UserUtils from "./users";
import { inspect } from "util";

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


	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
	clean(input: any): string{
		if (typeof (input) !== "string") {
			input = inspect(input, {
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