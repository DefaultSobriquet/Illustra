import { Guild, MessageEmbed, TextChannel } from "discord.js";
import GuildModel from "./../models/Guild";
import IllustraClient from "../structures/IllustraClient";

export default async function (Illustra: IllustraClient, guild: Guild): Promise<void> {
	try {
		const mongoGuild = new GuildModel({ id: guild.id }); // Add the new guild model
		await mongoGuild.save();

		const logs = await Illustra.client.channels.fetch(Illustra.config.settings.log); // Log the guild addition
		if(!(logs instanceof TextChannel)) return;

		const embed = new MessageEmbed()
			.setTitle(`New Guild: ${guild.name}`)
			.setColor(0x2f3136)
			.setTimestamp()
			.setDescription(`A guild of ${guild.memberCount} members owned by \`\`${guild.owner!.user.tag}\`\`, ${guild.name} was created at ${guild.createdAt.toLocaleString()}.`)
			.setThumbnail(guild.iconURL() ?? "")
			.setFooter(`${guild.name} is Guild #${Illustra.client.guilds.cache.size} for ${Illustra.config.name}.`);

		logs.send(embed);

	}catch (err){
		console.error(err);
	}
}