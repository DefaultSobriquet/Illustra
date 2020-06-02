import {sample} from "lodash";
import { Message} from "discord.js";

export const run = async (client: any, message: Message, args: string[], flags: string[]) => { // eslint-disable-line no-unused-vars
	const msg = await message.channel.send("Pong!");
	const tips = [`Restrict usage of emotes in your server with \`${client.config.name}lock\`!`, 
		`See an emote you like? \`${client.config.name} obtain [message ID]\` it!`, `Questions? *Psst* — the support server's link is in \`${client.config.name} info\`!`];

	msg.edit(`Pong! \`${msg.createdTimestamp - message.createdTimestamp}ms\`\n${flags.includes("tip") ? sample(tips) : ""}`);
};

export const conf = {
	aliases: ["latency", "pong"],
	perms: [], 
	requires: ["SEND_MESSAGES"]
};

export const help = {
	name: "ping",
	category: "Information",
	description: "Check the bot and Discord's API latency.",
	usage: "ping",
	example: "ping"
};
