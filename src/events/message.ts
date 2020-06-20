import { Message, MessageEmbed, TextChannel} from "discord.js";
import {startCase, toLower} from "lodash";
import {ICommandContext} from "../types";
import {Command} from "../structures/Command";
import GuildModel from "../models/Guild";
import IllustraClient from "../structures/IllustraClient";

export default async function (Illustra: IllustraClient, message: Message): Promise<void> {

	let prefix: (string|undefined);

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
	const prefixMention = new RegExp(`^<@!?${Illustra.client.user!.id}>`);
	prefix = message.content.match(prefixMention)?.shift() ?? prefix;

	// Name Prefix
	prefix = message.content.startsWith(Illustra.config.name) ? Illustra.config.name : prefix;

	if(!prefix) return;

	// Prevent execution by bots and checks for messages without the prefix, within a guild.
	if (message.author.bot || !message.content.startsWith(prefix)) return;

	// Create arguments and command from message.
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	// Input would always be empty string in a failing case.
	const command = args.shift()!.toLowerCase();

	// Retrieve command
	const cmd = Illustra.commands.get(command) ?? Illustra.commands.find((c: Command) => c.aliases.includes(command));
	if (!cmd) return;

	const ctx: ICommandContext = {
		message,
		args,
		user: message.author,
		channel: message.channel
	};

	if (message.guild && message.channel instanceof TextChannel) {
		// Permission checks (this will need to be reworked)
		if (!message.member!.hasPermission(cmd.userPerms) && !Illustra.config.devs.includes(message.author.id))
			return;

		
		const missingPerms = message.channel.permissionsFor(Illustra.client.user!)!.missing(cmd.botPerms);

		if (missingPerms.length > 0) {
			const embed = new MessageEmbed()
				.setTitle("Permissions Error")
				.setTimestamp()
				// It would be optimal to fetch the Illlustra guild member for each guild to get the color (or just remove it — is adaptive colouring such a useful feature?).
				.setColor(message.guild.me!.displayColor || 0x2f3136)
				.setDescription(`I don't have adequate permissions to run \`${cmd.name}\`.`)
				.addField("Missing Permissions", `\`${missingPerms.map((p: string) => startCase(toLower(p))).join(", ")}\``)
				.setFooter(`${message.guild.name} | Missing Permissions`, message.guild.iconURL() ?? undefined);

			message.author.send(embed).catch();
			return;
		}

		ctx.member = message.member ?? undefined;
		ctx.guild = message.guild;
	}

	// Arg check
	if(args.length < cmd.reqArgs){
		message.channel.send(`The command \`\`${cmd.name}\`\` requires at least ${cmd.reqArgs} argument${cmd.reqArgs > 1 ? "s" : ""} to run, silly.`);
		return;
	}

	// Dev check
	if(cmd.devOnly && !Illustra.config.devs.includes(ctx.user.id)){
		message.channel.send("I know! I wish I was a developer too sometimes.");
		return;
	}

	Illustra.logger.info(`${message.author.username} [${message.author.id}] ran command ${cmd.name}.`);
	cmd.execute(ctx, Illustra);
}
