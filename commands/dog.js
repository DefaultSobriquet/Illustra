// eslint-disable-next-line no-unused-vars
exports.run = async (client, message, args) => {
	const r2 = require("r2");
	const { RichEmbed } = require("discord.js");
	const headers = {"x-api-key": client.config.api_tokens.thedogapi};
	const request = await r2.get("https://api.thedogapi.com/v1/images/search", { headers }).json;
	const embed = new RichEmbed()
		.setTitle("Woof!")
		.setImage(request[0].url)
		.setColor(message.guild.me.displayColor)
		.setTimestamp()
		.setFooter("Powered by TheDogAPI");
	message.channel.send(embed);
};
exports.conf = {
	aliases: ["woof"],
	permLevel: 0,
	userRequires: ["SEND_MESSAGES"],
	requires: ["SEND_MESSAGES"]
};

exports.help = {
	name: "dog",
	category: "Entertainment",
	description: "Find a dog.",
	usage: "dog",
	example: "dog"
};