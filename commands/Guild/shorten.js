const axios = require("axios").default;
exports.run = async (client, message, args, flags) => { // eslint-disable-line no-unused-vars
	if(!args[0]) return message.channel.send("Please enter a URL.");
	
	axios.get(`https://zws.im/api/shortenURL?url=${args[0]}`)
		.then((response) => {
			message.channel.send(`**Here's your ZWS URL for <${args[0]}>.**\n\`\`\`https://zws.im/${response.data.short}/\`\`\``);
		}).catch((error) => {
			const response = error.response;
			if ([400, 413].includes(response.status)) return message.channel.send(`Error: ${response.data.error}.`);
			return message.channel.send("There was an unexpected error.");
		});

};

exports.conf = {
	aliases: ["short", "zws"],
	perms: [],
	flags: [], 
	requires: ["SEND_MESSAGES"]
};

exports.help = {
	name: "shorten",
	category: "Guild",
	description: "Shortens a URL with the [Zero Width Shortener](https://zws.im/ 'This is the Zero-Width Shortener site.').",
	usage: "shorten [url]",
	example: "shorten https://google.com"
};
