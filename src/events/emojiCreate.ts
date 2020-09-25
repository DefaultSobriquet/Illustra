import { MessageEmbed, TextChannel, GuildEmoji} from "discord.js";
import IllustraClient from "../structures/IllustraClient";

export default async function(Illustra: IllustraClient, emote: GuildEmoji): Promise<void>{

	// Retrieve logging channel property on Guild or asynchronously via MongoDB
	const logChannelID = await Illustra.managers.guild.getLogChannel(emote.guild.id);
	if(!logChannelID) return;
	// Fetch channel from Illustra.
	const logChannel = await Illustra.client.channels.fetch(logChannelID, true);
	// In theory, this should never be triggered, since we should check whether the ID provided is a valid channel beforehand.
	if(!(logChannel instanceof TextChannel)) return;
	// Log the addition of an emote on the Guild channel

	const embed = new MessageEmbed()
		.setTitle(`[Added] ${emote.animated ? "Animated" : "Still"} Emote - ${emote.name}`)
		.setTimestamp(emote.createdAt)
		.setColor("GREEN")
		.setDescription(`**ID**: ${emote.id}\n**Link**: [Image URL](${emote.url} 'Click me for the image!')`)
		.setImage(emote.url)
		.setFooter(`${emote.guild.name} • Created`, emote.guild.iconURL() ?? undefined);

	await logChannel.send(embed);
	return;
}