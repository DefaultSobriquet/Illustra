// eslint-disable-next-line no-unused-vars
exports.run = async (client, message, args) => {
	const axios = require("axios").default;
	const { RichEmbed } = require("discord.js");
	const headers = {"x-api-key": client.config.api_tokens.thedogapi};
	const request = (await axios.get("https://api.thedogapi.com/v1/images/search", { headers })).data;
	const embed = new RichEmbed()
		.setTitle("Woof!")
		.setImage(request[0].url)
		.setColor(message.guild.me.displayColor)
		.setTimestamp()
		.setFooter(`Requested by ${message.author.tag} • Powered by TheDogAPI`);
	message.channel.send(embed);
};
exports.conf = {
	aliases: ["woof"],
	requires: ["SEND_MESSAGES"]
};

exports.help = {
	name: "dog",
	category: "Entertainment",
	description: "Find a dog.",
	usage: "dog",
	example: "dog"
};