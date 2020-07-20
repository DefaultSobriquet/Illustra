import { Message, Guild, User, GuildMember, TextChannel, DMChannel, Client, NewsChannel } from "discord.js";
import IllustraClient from "./structures/IllustraClient";

export interface IObject{
	[key: string]: string
}

export interface ICommandContext{
	message: Message,
	channel: (TextChannel|DMChannel|NewsChannel)
	user: User,
	member?: GuildMember
	guild?: Guild,
	args: string[],
	flags: IObject
}

export interface IConfig{
	token: string,
	name: string,
	owner: string,
	devs: string[],
	description: string,
	support: string,
	invite: string,
	api_tokens: { 
		thecatapi: string,
		thedogapi: string
	},
	mongo: {
		database: string,
		username: string, 
		password: string
	},
	settings: { 
		log: string
	}
}

export interface IClientOptions{
	config: IConfig;
}

export interface IUtilsOptions{
	client: Client;
}

export interface IFlagOptions{
	name: string;
	description: string;
	hasValue: boolean;
	usage?: string;
	example?: string;
}

export interface IManagerOptions{
	Illustra: IllustraClient
}