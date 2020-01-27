// eslint-disable-next-line no-unused-vars
exports.run = async (client, message, args) => {
	const r2 = require("r2");
	const { RichEmbed } = require("discord.js");
	const headers = {"x-api-key": client.config.api_tokens.thecatapi};
	const request = await r2.get("https://api.thecatapi.com/v1/images/search", { headers }).json;
	const embed = new RichEmbed()
		.setTitle("Meow!")
		.setImage(request[0].url)
		.setColor(message.guild.me.displayColor)
		.setTimestamp()
		.setFooter(`Requested by ${message.author.tag} • Powered by TheCatAPI`);
	message.channel.send(embed);
};
exports.conf = {
	aliases: ["meow"],
	requires: ["SEND_MESSAGES"]
};

exports.help = {
	name: "cat",
	category: "Entertainment",
	description: "Find a cat.",
	usage: "cat",
	example: "cat"
};