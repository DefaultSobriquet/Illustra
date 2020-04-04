exports.run = async (client, message, args) => { // eslint-disable-line no-unused-vars
	const {search} = client.utils.emotes;
	const {MessageEmbed} = require("discord.js");
	const _ = require("lodash");
	const emojis = [...search(args.join("_"), message).values()];
	const [animated, static] = _.partition(emojis, e => e.animated);
	const embed = new MessageEmbed()
		.setTitle("Emotes")
		.setTimestamp();
	
	embed.setDescription(`Static - ${static.length} | Animated - ${animated.length}`, "\u200B");

	_.chunk(static.sort((a, b) => (_.toLower(a.name) >= _.toLower(b.name)) ? 1 : -1), 10).forEach(chunk => {
		const first = chunk[0].name.slice(0, 2);
		const last = chunk[chunk.length-1].name.slice(0, 2);
		embed.addField(_.toLower(`${first} to ${last}`), chunk.map(e => `${e}`).join(" "));
	});

	_.chunk(animated.sort((a, b) => (_.toLower(a.name) >= _.toLower(b.name)) ? 1 : -1), 10).forEach(chunk => {
		const first = chunk[0].name.slice(0, 2);
		const last = chunk[chunk.length-1].name.slice(0, 2);
		embed.addField(_.toLower(`${first} to ${last}`), chunk.map(e => `${e}`).join(" "));
	});
	
	message.channel.send(embed);
};

exports.conf = {
	aliases: [],
	requires: ["SEND_MESSAGES", "EMBED_LINKS"]
};

exports.help = {
	name: "emotes",
	category: "Emotes",
	description: "List all emotes in a server.",
	usage: "emotes",
	example: "emotes"
};