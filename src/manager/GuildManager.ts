import { Document } from "mongoose";
import Guild, { IGuild } from "../models/Guild";
import IllustraClient from "../structures/IllustraClient";
import { IManagerOptions } from "../types";

class GuildManager{
	Illustra: IllustraClient;
	model: typeof Guild;
	constructor(options: IManagerOptions){
		this.Illustra = options.Illustra;
		this.model = Guild;
	}
	async retrieve(guildID: string): Promise<IGuild & Document | null>{
		const guildDoc = await Guild.findOne({id: guildID});
		return guildDoc;
	}
}

export default GuildManager;
