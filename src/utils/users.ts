import { Message, Client, GuildMember } from "discord.js";
import { IUtilsOptions } from "../types";

class UserUtils{
	client: Client;
	constructor(options: IUtilsOptions){
		this.client = options.client;
	}
	/**
	 * Resolves a string input into a GuildMember
	 * @param {string} input An input to resolve to a GuildMember 
	 * @param {Message} message A message to reference for the guild (will also check mentions)
	 * @returns {GuildMember|undefined} A GuildMember resolved from the input (or undefined, if not found)
	 */

	resolve = (input: string, message: Message): (GuildMember|undefined) => {
			
		if (!input) return message.member ?? undefined;
		
		const members = message.guild!.members.cache;

		let target = message.mentions.members!.first() || members.find((member) => Boolean((member.user.tag === input) || (member.user.id === input) ||
			(member.user.username === input) || (member.nickname && member.nickname === input)));
		
		target = target ?? members.find((member) => Boolean(((member.user.username.toLowerCase() + "#" + member.user.discriminator) === input.toLowerCase()) ||
			(member.user.username.toLowerCase() === input.toLowerCase()) || (member.nickname && member.nickname.toLowerCase() === input.toLowerCase())));

		target = target ?? members.find((member) => (member.user.username.startsWith(input)) ||
		(member.user.username.toLowerCase().startsWith(input.toLowerCase())));

		target = target ?? members.find((member) => Boolean((member.nickname && member.nickname.startsWith(input)) ||
			(member.nickname && member.nickname.toLowerCase().startsWith(input.toLowerCase()))));
			
		target = target ?? members.find((member) => Boolean((member.user.username.toLowerCase().includes(input.toLowerCase())) ||
			(member.nickname && member.nickname.toLowerCase().includes(input.toLowerCase()))));
		
		return target;
	}
}

export default UserUtils;