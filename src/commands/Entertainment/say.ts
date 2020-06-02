import { Message } from "discord.js";

export const run = async (client: any, message: Message, args: string[], flags: string[]) => { // eslint-disable-line no-unused-vars
	message.delete().catch();
	message.channel.send(args.join(" ")).catch();
};

export const conf = {
	aliases: ["speak", "echo"],
	perms: ["MANAGE_MESSAGES"], 
	requires: ["SEND_MESSAGES", "MANAGE_MESSAGES"]
};

export const help = {
	name: "say",
	category: "Entertainment",
	description: "Make the bot say something.",
	usage: "say",
	example: "say"
};
