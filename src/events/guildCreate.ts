import { Guild, MessageEmbed } from "discord.js";
import GuildModel from "./../models/Guild";

export default async function (client: any, guild: Guild) {
	try {
		const mongoGuild = new GuildModel({ id: guild.id }); // Add the new guild model
		await mongoGuild.save();

		const embed = new MessageEmbed()
			.setTitle(`New Guild: ${guild.name}`)
			.setColor(0x2f3136)
			.setTimestamp()
			.setDescription(`A guild of ${guild.memberCount} members owned by \`\`${guild!.owner!.user.tag}\`\`, ${guild.name} was created at ${guild.createdAt.toLocaleString()}.`)
			.setThumbnail(guild.iconURL() ?? "")
			.setFooter(`${guild.name} is Guild #${client.guilds.cache.size} for ${client.config.name}.`);

		const logs = await client.channels.fetch(client.config.settings.log); // Log the guild addition
		logs.send(embed);

	}
	catch (err) {
		console.error(err);
	}
};