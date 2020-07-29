import { Client, DMChannel, Message, TextChannel } from "discord.js";
import { IUtilsOptions } from "../types";
import EmoteUtils from "./emotes";
import RoleUtils from "./roles";
import UserUtils from "./users";
import { inspect } from "util";
import ImageUtils from "./image";

class Utils{
	client: Client;
	emote: EmoteUtils;
	role: RoleUtils;
	user: UserUtils;
	image: ImageUtils;
	constructor(options: IUtilsOptions){
		this.client = options.client;
		this.emote = new EmoteUtils(options);
		this.role = new RoleUtils(options);
		this.user = new UserUtils(options);
		this.image = new ImageUtils(options);
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

	async parseMessage(input: string): Promise<Message|undefined>{
		const discordRegex = /https:\/\/discord(?:app)?\.com\/channels\/(?:\d{17,19}|@me)\/(\d{17,19})\/(\d{17,19})/;
		if(!discordRegex.test(input)) return undefined;
		try{
			const parsedMessage = discordRegex.exec(input)!;
		
			const channel = await this.client.channels.fetch(parsedMessage[1]);

			if(!(channel instanceof TextChannel) && !(channel instanceof DMChannel)) return undefined;
		
			const message = await channel.messages.fetch(parsedMessage[2]);
		
			return message;
		
		}catch(err){
			return undefined;
		}
	}
}

export default Utils;