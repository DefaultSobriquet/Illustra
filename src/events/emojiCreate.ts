import { MessageEmbed, TextChannel, GuildEmoji} from "discord.js";
import IllustraClient from "../structures/IllustraClient";

export default async function(Illustra: IllustraClient, emote: GuildEmoji): Promise<void>{
	// Retrieve logging channel property on Guild
	const logchannel = await Illustra.client.channels.fetch("ID", true);
	// In theory, this should never be triggered, since we should check whether the ID provided is a valid channel beforehand.
	if(!(logchannel instanceof TextChannel)) return;
	// Log the addition of an emote on the Guild channel
	const author = await emote.fetchAuthor();
	// Embed rough draft (this needs to be fixed)
	const embed = new MessageEmbed()
		.setTitle(`${emote.animated ? "Animated" : "Static"} Emote Created: ${emote.name} [${emote.id}]`)
		.setThumbnail(emote.url)
		.setAuthor(author.tag, author.displayAvatarURL())
		.setColor("GREEN")
		.setTimestamp();

	logchannel.send(embed);
}