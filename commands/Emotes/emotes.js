exports.run = async (client, message, args, flags) => { // eslint-disable-line no-unused-vars
	const {search} = client.utils.emotes;
	const {MessageEmbed} = require("discord.js");
	const {toLower, chunk, partition, lowerCase} = require("lodash");
	const emotes = [...search(args.join("_"), message).values()];
	if(!emotes.length) return message.channel.send("I could not find any emotes.");

	const [animated, static] = partition(emotes, e => e.animated);

	const embed = new MessageEmbed()
		.setAuthor(`${message.guild.name} ${args[0] ? `- ${args.join(" ")}` : ""}`, message.guild.iconURL())
		.setColor(message.guild.me.displayColor)
		.setTimestamp()
		.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
	
	embed.setDescription(`Static - ${static.length} | Animated - ${animated.length}`);

	const addEmbeds = (e) => chunk(e.sort((a, b) => (toLower(a.name) >= toLower(b.name)) ? 1 : -1), 20).forEach(chunk => {
		const first = chunk[0].name.slice(0, 2);
		const last = chunk[chunk.length-1].name.slice(0, 2);
		embed.addField(lowerCase(`${first} to ${last}`), chunk.map(e => `${e}`).join(" "));
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