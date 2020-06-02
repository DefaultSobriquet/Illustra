import {Message} from "discord.js";
export const run = async (client: any, message: Message, args: string[], flags: string[]) => { // eslint-disable-line no-unused-vars
	const {props, embed, resolve} = client.utils.emotes;
	const emote = /<?(a:)?(\w{2,32}):(\d{17,19})>?/.test(args[0]) ? props(args[0]) : resolve(args.join("_"), message);
	if (!emote) return message.channel.send("Please enter a valid emote.");
	message.channel.send(embed(emote, message));
};

export const conf = {
	aliases: ["emoji"],
	perms: [], 
	requires: ["SEND_MESSAGES", "EMBED_LINKS"]
};

export const help = {
	name: "emote",
	category: "Emotes",
	description: "Get information about an emote.",
	usage: "emote [emote]",
	example: "emote :rooThink:"
};
