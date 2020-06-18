import { Message, Guild, User, GuildMember, TextChannel, DMChannel, GuildEmoji, Emoji, MessageEmbed, Role, Client, Collection } from "discord.js";

export interface ICommandContext{
	message: Message,
	channel: (TextChannel|DMChannel)
	user: User,
	member?: GuildMember
	guild?: Guild,
	args: string[]
}

export interface IConfig{
	token: string,
	name: string,
	owner: string,
	trusted: string[],
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

export interface IRoleUtils{
	resolve: (input: string, guild: Guild) => Role;
}

export interface IMemberUtils{
	resolve: (input: string, guild: Guild) => GuildMember;
}