import {MessageEmbed, Message} from "discord.js";
import {toLower, chunk, partition, lowerCase} from "lodash";

export const run = async (client: any, message : Message, args: string[], flags: string[]) => { // eslint-disable-line no-unused-vars
	const {search} = client.utils.emotes;

	let emotes = [...search(args.join("_"), message).values()];
	if(flags.includes("locked")) emotes = emotes.filter(e => e.roles.cache.size);
	if(flags.includes("animated")) emotes = emotes.filter(e => e.animated);
	if(flags.includes("static")) emotes = emotes.filter(e => !e.animated);
	if(!emotes.length) return message.channel.send("I could not find any emotes.");

	const [a, s] = partition(emotes, e => e.animated);

	const embed = new MessageEmbed()
		.setAuthor(`${message!.guild!.name} ${args[0] ? `- ${args.join(" ")}` : ""}`, message.guild!.iconURL() ?? undefined)
		.setColor(message!.guild!.me!.displayColor || 0x2f3136)
		.setTimestamp()
		.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
	
	embed.setDescription(`Static - ${s.length} | Animated - ${a.length}`);

	const addEmbeds = (e:any) => chunk(e.sort((a:any, b:any) => (toLower(a.name) >= toLower(b.name)) ? 1 : -1), 20).forEach((chunk:any[]) => {
		const first = chunk[0].name.slice(0, 2);
		const last = chunk[chunk.length-1].name.slice(0, 2);
		embed.addField(lowerCase(`${first} to ${last}`), chunk.map(e => e.roles.cache.size || flags.includes("names") ? `\`${e.name}\`` : `${e}`).join(" "));
	});

	addEmbeds(s);
	addEmbeds(a);

	message.channel.send(embed);
};

export const conf = {
	aliases: ["serveremotes", "emojis"],
	perms: [], 
	requires: ["SEND_MESSAGES", "EMBED_LINKS"]
};

export const help = {
	name: "emotes",
	category: "Emotes",
	description: "List all emotes in a server.",
	usage: "emotes",
	example: "emotes"
};