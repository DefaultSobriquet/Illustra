exports.run = async (client, message, args, flags) => { // eslint-disable-line no-unused-vars
	const msg = await message.channel.send("Pong!");
	const prefix = client.config.sets.prefix;
	const _ = require("lodash/collection");
	const tips = [`Restrict usage of emotes in your server with \`${prefix}lock\`!`, 
		`See an emote you like? \`${prefix}obtain [message ID]\` it!`, `Questions? *Psst* — the support server's link is in \`${prefix}info\`!`];

	msg.edit(`Pong! \`${msg.createdTimestamp - message.createdTimestamp}ms\`\n${flags.includes("tip") ? _.sample(tips) : ""}`);
};

exports.conf = {
	aliases: ["latency", "pong"],
	perms: [], 
	requires: ["SEND_MESSAGES"]
};

exports.help = {
	name: "ping",
	category: "Information",
	description: "Check the bot and Discord's API latency.",
	usage: "ping",
	example: "ping"
};
