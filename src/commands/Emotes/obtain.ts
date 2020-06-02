
import {partition} from "lodash";
import {MessageEmbed, Message, GuildEmoji} from "discord.js";

export const run = async (client: any, message: Message, args: string[], flags: string[]) => { // eslint-disable-line no-unused-vars
	const {extract, props, space} = client.utils.emotes;

	let target;

	if(args.some(arg => /<?(a:)?(\w{2,32}):(\d{17,19})>?/.test(arg))) target = message;

	if (!target && args[0] && /^\d{17,19}$/.test(args[0])) target = await message.channel.messages.fetch(args[0], true)
		.catch(() => {
			message.channel.send("I could not get that message. Are you in the same channel?");
		});

	if (!target) return message.channel.send("Please provide either a message ID or emotes as arguments!");

	const emotes = extract(target).map((emote:any) => props(emote));
	const [a, s] = partition(emotes, "animated");

	if(!emotes.length) return message.channel.send("I couldn't find any new emotes!");

	const server = space(message);

	if(server.animated - a.length < 0 || server.static - s.length < 0){
		return message.channel.send(`I can't add that many emotes! Currently, there are ${server.static}/${server.limit} static and ${server.animated}/${server.limit} animated spaces for emotes.`);
	}

	const embed = new MessageEmbed()
		.setTitle("Obtaining Status")
		.setAuthor(message!.guild!.name, message!.guild!.iconURL() ?? undefined)
		.setColor(message!.guild!.me!.displayColor || 0x2f3136)
		.setTimestamp()
		.setDescription(`**I found ${emotes.length} emote${emotes.length > 1 ? "s" : ""}!**\n${emotes.map((e:any) => `\`[ID ${e.id}] - ${e.name}\``).join("\n")}`)
		.addField("Message", `[Jump!](${target.url} 'Emotes were obtained from this message.')`, true)
		.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());

	const status = await message.channel.send(embed);
	
	if(flags.includes("dry")) return;

	const success: GuildEmoji[] = [];
	const failed: GuildEmoji[] = [];

	message.channel.startTyping();

	for (const emote of emotes) {
		await message!.guild!.emojis.create(emote.url, emote.name, {reason: `Obtained by ${message.author.tag}!`})
			.then((e) => success.push(e))
			.catch(() => {
				failed.push(emote);
				status.edit(`There was a unexpected error for ${emote.name}! The emote may have been a legacy emote above 256KB.`);
			});
	}

	embed.setDescription(success.join(" | "));
	if(failed.length) embed.addField("Failed to Add", failed.map(e => `\`${e.name}\``).join(" | "), true);

	status.edit(`Completed! I've added ${success.length}/${emotes.length} of your requested emotes.`, embed).finally(() => message.channel.stopTyping(true));

};

export const conf = {
	aliases: ["steal"],
	perms: ["MANAGE_EMOJIS"], 
	requires: ["SEND_MESSAGES", "VIEW_CHANNEL", "MANAGE_EMOJIS", "READ_MESSAGE_HISTORY"]
};

export const help = {
	name: "obtain",
	category: "Emotes",
	description: "Add custom emotes from a message to the server.",
	usage: "obtain [message id | ...emotes]",
	example: "obtain 29394959239030102"
};
