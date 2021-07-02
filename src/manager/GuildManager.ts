import { Document } from "mongoose";
import Guild, { IGuild } from "../models/Guild";
import IllustraClient from "../structures/IllustraClient";
import { IManagerOptions } from "../types";
import GuildModel from "../models/Guild";

// Hack to extend the Discord.js module

declare module "discord.js" {
	interface Guild{
		logChannel?: string;
	}
}

class GuildManager{
	Illustra: IllustraClient;
	model: typeof Guild;
	constructor(options: IManagerOptions){
		this.Illustra = options.Illustra;
		this.model = Guild;
	}
	async retrieve(guildID: string, required = false): Promise<IGuild & Document | null>{
		const guildDoc = await Guild.findOne({id: guildID});
		if(!guildDoc && required){
			const mongoGuild = new GuildModel({ id: guildID }); // Add the new guild model, ensuring existence.
			await mongoGuild.save();
			return mongoGuild;
		}
		return guildDoc;
	}
	async setLogChannel(guildID: string, channelID: string): Promise<IGuild & Document | null>{
		const guildDoc = await this.retrieve(guildID);
		if(!guildDoc) return null;
		guildDoc.logChannel = channelID;
		return guildDoc.save();
	}
	async getLogChannel(guildID: string): Promise<string | null> {
		const guild = this.Illustra.client.guilds.resolve(guildID);
		if(!guild) return null;
		if(guild.logChannel) return guild.logChannel;
		const guildDoc = await this.retrieve(guildID);
		if(!guildDoc?.logChannel) return null;
		guild["logChannel"] = guildDoc.logChannel;
		return guildDoc.logChannel;
	}
}

export default GuildManager;
