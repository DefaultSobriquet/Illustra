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
}

export default Utils;