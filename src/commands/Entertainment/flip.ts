import { Message } from "discord.js";

export const run = async (client: any, message: Message, args: string[], flags: string[]) => { // eslint-disable-line no-unused-vars
	message.channel.send(["`Heads!`", "`Tails!`"][Math.floor(Math.random() * 2)]);
};

export const conf = {
	aliases: ["coin", "coinflip"],
	perms: [], 
	requires: ["SEND_MESSAGES"]
};

export const help = {
	name: "flip",
	category: "Entertainment",
	description: "Flip a coin.",
	usage: "flip",
	example: "flip"
};
