exports.run = async (client, message, args, flags) => { // eslint-disable-line no-unused-vars
	const {search} = client.utils.emotes;
	const {MessageEmbed, Util} = require("discord.js");
	const _ = require("lodash");
	const emotes = [...search(args.join("_"), message).values()];
	if(emotes.length === 0) return message.channel.send("I could not find any emotes.");

	const [animated, static] = _.partition(emotes, e => e.animated);

	const embed = new MessageEmbed()
		.setAuthor(`${message.guild.name} ${args[0] ? `- ${args.join(" ")}` : ""}`, message.guild.iconURL())
		.setColor(message.guild.me.displayColor)
		.setTimestamp()
		.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
	
	embed.setDescription(`Static - ${static.length} | Animated - ${animated.length}`);

	const addEmbeds = (e) => _.chunk(e.sort((a, b) => (_.toLower(a.name) >= _.toLower(b.name)) ? 1 : -1), 20).forEach(chunk => {
		const first = chunk[0].name.slice(0, 2);
		const last = chunk[chunk.length-1].name.slice(0, 2);
		embed.addField(Util.escapeMarkdown(_.toLower(`${first} to ${last}`)), chunk.map(e => `${e}`).join(" "));
	});

	addEmbeds(static);
	addEmbeds(animated);

	message.channel.send(embed);
};

exports.conf = {
	aliases: ["serveremotes", "emojis"],
	perms: [], 
	requires: ["SEND_MESSAGES", "EMBED_LINKS"]
};

exports.help = {
	name: "emotes",
	category: "Emotes",
	description: "List all emotes in a server.",
	usage: "emotes",
	example: "emotes"
};