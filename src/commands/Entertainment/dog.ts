import axios from "axios";
import {MessageEmbed, Message} from "discord.js";
export const run = async (client: any, message: Message, args: string[], flags: string[]) => { // eslint-disable-line no-unused-vars
	const headers = {"x-api-key": client.config.api_tokens.thedogapi};
	
	const request = (await axios.get("https://api.thedogapi.com/v1/images/search", {headers})).data;
	
	const embed = new MessageEmbed()
		.setTitle("Woof!")
		.setImage(request[0].url)
		.setColor(message!.guild!.me!.displayColor || 0x2f3136)
		.setTimestamp()
		.setFooter(`Requested by ${message.author.tag} • Powered by TheDogAPI`);
	
	message.channel.send(embed);
};
exports.conf = {
	aliases: ["woof"],
	perms: [], 
	requires: ["SEND_MESSAGES"]
};

exports.help = {
	name: "dog",
	category: "Entertainment",
	description: "Find a dog.",
	usage: "dog",
	example: "dog"
};
