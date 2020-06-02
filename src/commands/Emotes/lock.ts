import uniq from "lodash"
import {Message, MessageEmbed} from "discord.js";
export const run = async (client: any, message: Message, args: string[], flags: string[]) => { // eslint-disable-line no-unused-vars
	const {resolve} = client.utils.emotes;
	
	const emote = resolve(args[0], message);

	if (!emote) return message.channel.send("I could not find the emote provided.");

	let roles = args.slice(1).map((role) => client.utils.roles.resolve(role, message)).filter((role) => Boolean(role));

	if(!roles.length) return message.channel.send("I could not find any valid roles!");

	const integrated = message!.guild!.me!.roles.cache.find((role) => role.managed);
	
	

	if (integrated) roles.push(integrated);
	//@ts-ignore The collection is an array?
	roles = uniq(roles);
	

	const embed = new MessageEmbed()
		.setTitle(`Lock Emote [${emote.name}]`)
		.setTimestamp()
		.setImage(emote.url)
		.setColor(message!.guild!.me!.displayColor || 0x2f3136)
		.setDescription(`**Roles**: ${roles.join(", ")}`)
		.setFooter(`${message.author.tag}`, message.author.displayAvatarURL());

	await message.channel.send((!integrated) ? "Warning! I don't have an integrated role and will no longer be able to use this emote." : "", embed);

	emote.roles.set(roles)
		.then((emote:any) => message.channel.send(`\`🔒\` | [ID \`\`${emote.id}\`\`] — \`\`${emote.name}\`\``))
		.catch((err:Error) => {
			console.log(err);
			message.channel.send("There was a unexpected error.");
		});
};

export const conf = {
	aliases: ["restrict"],
	perms: ["MANAGE_EMOJIS", "MANAGE_ROLES"], 
	requires: ["SEND_MESSAGES", "MANAGE_EMOJIS", "EMBED_LINKS"]
};

export const help = {
	name: "lock",
	category: "Emotes",
	description: "Lock an emote to specific roles.",
	usage: "lock [emote] [...role]",
	example: "lock :rooThink: Pandas"
};