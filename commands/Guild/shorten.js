exports.run = async (client, message, args) => { // eslint-disable-line no-unused-vars
	const axios = require("axios").default;

	axios.get(`https://zws.im/api/shortenURL?url=${args[0]}`)
		.then((response) => {
			message.channel.send(`**Here's your ZWS URL for <${args[0]}>.**\n\`\`\`https://zws.im/${response.data.short}/\`\`\``);
		}).catch((error) => {
			const response = error.response;
			if ([400, 413].includes(response.status)) return message.channel.send(`**ERROR:** ${response.data.error}`);
			return message.channel.send("There was an unexpected error.");
		});
		
};

exports.conf = {
	aliases: ["short", "zws"],
	requires: ["SEND_MESSAGES"]
};

exports.help = {
	name: "shorten",
	category: "Guild",
	description: "Shortens a URL with the [Zero Width Shortener](https://zws.im/).",
	usage: "shorten [url]",
	example: "shorten https://google.com"
};
