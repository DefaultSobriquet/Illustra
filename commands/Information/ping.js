const {sample} = require("lodash/collection");
exports.run = async (client, message, args, flags) => { // eslint-disable-line no-unused-vars
	const msg = await message.channel.send("Pong!");
	const tips = [`Restrict usage of emotes in your server with \`${client.config.name}lock\`!`, 
		`See an emote you like? \`${client.config.name} obtain [message ID]\` it!`, `Questions? *Psst* — the support server's link is in \`${client.config.name} info\`!`];

	msg.edit(`Pong! \`${msg.createdTimestamp - message.createdTimestamp}ms\`\n${flags.includes("tip") ? sample(tips) : ""}`);
};

exports.conf = {
	aliases: ["latency", "pong"],
	perms: [],
	flags: [], 
	requires: ["SEND_MESSAGES"]
};

exports.help = {
	name: "ping",
	category: "Information",
	description: "Check the bot and Discord's API latency.",
	usage: "ping",
	example: "ping"
};
