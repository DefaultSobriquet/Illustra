import { Guild, MessageEmbed } from "discord.js";
import GuildModel from "./../models/Guild";
import IllustraClient from "../structures/IllustraClient";

export default async function (Illustra: IllustraClient, guild: Guild) {
	try {
		const mongoGuild = new GuildModel({ id: guild.id }); // Add the new guild model
		await mongoGuild.save();

		const embed = new MessageEmbed()
			.setTitle(`New Guild: ${guild.name}`)
			.setColor(0x2f3136)
			.setTimestamp()
			.setDescription(`A guild of ${guild.memberCount} members owned by \`\`${guild!.owner!.user.tag}\`\`, ${guild.name} was created at ${guild.createdAt.toLocaleString()}.`)
			.setThumbnail(guild.iconURL() ?? "")
			.setFooter(`${guild.name} is Guild #${Illustra.client.guilds.cache.size} for ${Illustra.config.name}.`);

		const logs = await Illustra.client.channels.fetch(Illustra.config.settings.log); // Log the guild addition
		//@ts-ignore We know the config provides a text channel.
		logs.send(embed);

	}
	catch (err) {
		console.error(err);
	}
};