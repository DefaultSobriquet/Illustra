import { Guild, MessageEmbed, TextChannel } from "discord.js";
import IllustraClient from "../structures/IllustraClient";

export default async function (Illustra: IllustraClient, guild: Guild): Promise<void> {
	try {
		
		await Illustra.managers.guild.retrieve(guild.id, true); // Create guild model.

		const logs = await Illustra.client.channels.fetch(Illustra.config.settings.log); // Fetch the logger channel
		if(!(logs instanceof TextChannel)) return;

		const embed = new MessageEmbed()
			.setTitle(`Joined Guild: ${guild.name}`)
			.setColor(0x2f3136)
			.setTimestamp()
			.setDescription(`A guild of ${guild.memberCount} members owned by \`\`${guild.owner!.user.tag}\`\`, ${guild.name} was created at ${guild.createdAt.toLocaleString()}.`)
			.setThumbnail(guild.iconURL() ?? "")
			.setFooter(`${guild.name} is Guild #${Illustra.client.guilds.cache.size} for ${Illustra.config.name}.`);

		logs.send(embed);

	}catch (err){
		Illustra.logger.error(err);
	}
}