import { Message, MessageEmbed} from "discord.js";
import {startCase, toLower} from "lodash";
import { ICommandContext } from "../types";
import {Command} from "../structures/Command";
import GuildModel from "../models/Guild";

// Note: This needs to be changed to an Illustra Client later
export default async function (client: any, message: Message) {

	let prefix;

	if (message.guild) {
		//Fetch the guild member if unavailable
		if (!message.member)
			await message.guild.members.fetch(message.author.id);
		let guild = await GuildModel.findOne({ id: message.guild.id });
		if (!guild) {
			guild = new GuildModel({ id: message.guild.id });
			await guild.save();
		}
		prefix = guild.prefix; // Guild prefix as starting prefix
	}

	// Mention Prefix
	const prefixMention = new RegExp(`^<@!?${client.user.id}>`);
	prefix = message.content.match(prefixMention)?.shift() ?? prefix;

	// Name Prefix
	prefix = message.content.startsWith(client.config.name) ? client.config.name : prefix;

	// Prevent execution by bots and checks for messages without the prefix, within a guild.
	if (message.author.bot || !message.content.startsWith(prefix))
		return;

	// Create arguments and command from message.
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	// Input would always be empty string in a failing case.
	const command = args.shift()!.toLowerCase();

	// Retrieve command
	let cmd = client.commands.get(command) ?? client.commands.find((c: Command) => c.aliases.includes(command));
	if (!cmd)
		return;

	if (message.guild) {
		// Permission checks (this will need to be reworked)
		if (!message.member!.hasPermission(cmd.conf.perms) && !client.config.trusted.includes(message.author.id))
			return;

		//@ts-ignore This message will never be in a DM channel because the message has a guild.
		const missingPerms = message.channel.permissionsFor(client.user).missing(cmd.conf.requires);

		if (missingPerms.length > 0) {
			const embed = new MessageEmbed()
				.setTitle("Permissions Error")
				.setTimestamp()
				// It would be optimal to fetch the Illlustra guild member for each guild to get the color (or just remove it — is adaptive colouring such a useful feature?).
				.setColor(message.guild.me!.displayColor || 0x2f3136)
				.setDescription(`I do not have adequate permissions to run the command \`${cmd.help.name}\`.`)
				.addField("Missing Permissions", `\`${missingPerms.map((p: string) => startCase(toLower(p))).join(", ")}\``)
				.setFooter(`${message.guild.name} | Missing Permissions`, message.guild.iconURL() ?? undefined);

			message.author.send(embed).catch((err) => console.log(err));
			return;
		}
	}

	const ctx: ICommandContext = {
		message,
		args,
		user: message.author,
		channel: message.channel
	};

	console.log(`${message.author.username} [${message.author.id}] ran command ${cmd.help.name}`);
	cmd.run(ctx, client);
};
