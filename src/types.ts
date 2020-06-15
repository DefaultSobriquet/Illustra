import { Message, Guild, User, GuildMember, TextChannel, DMChannel } from "discord.js";

export interface ICommandContext{
	message: Message,
	channel: (TextChannel|DMChannel)
	user: User,
	member?: GuildMember
	guild?: Guild,
	args: string[]
}