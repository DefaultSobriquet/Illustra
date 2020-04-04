exports.run = async (client, message, args) => { // eslint-disable-line no-unused-vars
	const axios = require("axios").default;
	const {MessageEmbed} = require("discord.js");
	const headers = {"x-api-key": client.config.api_tokens.thecatapi};
	
	const request = (await axios.get("https://api.thecatapi.com/v1/images/search", {headers})).data;
	
	const embed = new MessageEmbed()
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
