module.exports = async (client, message) => { // eslint-disable-line no-unused-vars
	const {MessageEmbed} = require("discord.js");
	const {partition, startCase, toLower} = require("lodash");
	const GuildModel = require("../models/Guild.js");

	if(!message.guild) return;

	let guild = await GuildModel.findOne({id: message.guild.id});

	if(!guild){
		guild = new GuildModel({id: message.guild.id});
		await guild.save();
	}

	let prefix = guild.prefix;

	// Mention Prefix
	const prefixMention = new RegExp(`^<@!?${client.user.id}>`);
	prefix = message.content.match(prefixMention) ? message.content.match(prefixMention)[0] : prefix;

	// Name Prefix
	prefix = message.content.startsWith(client.config.name) ? client.config.name : prefix;

	// Prevent execution by bots and checks for messages without the prefix, within a guild.
	if (message.author.bot || !message.content.startsWith(prefix)) return;

	// Create arguments and command from message.
	const input = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = input.shift().toLowerCase();

	// Fetches the user.
	if (!message.member) await message.guild.fetch(message.author.id);

	// Retrieve command
	const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

	if (!cmd) return;

	let [args, flags] = partition(input, i => !i.startsWith("--") || (cmd.help.name === "execute"));
	flags = flags.map(flag => flag.replace("--", "").toLowerCase());

	if(!message.member.hasPermission(cmd.conf.perms) && !client.config.trusted.includes(message.author.id)) return;

	const missingPerms = message.channel.permissionsFor(client.user).missing(cmd.conf.requires);

	if (missingPerms.length > 0){
		const embed = new MessageEmbed()
			.setTitle("Permissions Error")
			.setTimestamp()
			.setColor(message.guild.me.displayColor || 0x2f3136)
			.setDescription(`I do not have adequate permissions to run the command \`${cmd.help.name}\`.`)
			.addField("Missing Permissions", `\`${missingPerms.map(p => startCase(toLower(p))).join(", ")}\``)
			.setFooter(`${message.guild.name} | Missing Permissions`, message.guild.iconURL());
			
		message.author.send(embed).catch((err) => console.log(err));
		return;
	}

	console.log(`${message.author.username} [${message.author.id}] ran command ${cmd.help.name}`);
	cmd.run(client, message, args, flags);
};
