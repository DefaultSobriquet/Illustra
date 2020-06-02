import { Message } from "discord.js";
export const run = async (client: any, message: Message, args:string[], flags:string[]) => { // eslint-disable-line no-unused-vars
	const {embed, resolve} = client.utils.emotes;
	const emote = resolve(args[0], message);
	
	if (!emote) return message.channel.send("Please enter a valid emote.");
	
	await message.channel.send(embed(emote, message));
	
	emote.delete(`Removed by ${message.author.tag}`)
		.then((emote: any) => message.channel.send(`\`🗑️\` | [ID \`\`${emote.id}\`\`] — \`\`${emote.name}\`\``))
		.catch((err: any) => {
			console.log(err);
			message.channel.send("There was a unexpected error.");
		});
};

export const conf = {
	aliases: ["delete", "del"],
	perms: ["MANAGE_EMOJIS"], 
	requires: ["SEND_MESSAGES", "EMBED_LINKS"]
};

export const help = {
	name: "remove",
	category: "Emotes",
	description: "Remove an emote from the current guild.",
	usage: "remove [emote]",
	example: "remove :rooThink:"
};
