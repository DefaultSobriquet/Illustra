exports.run = async (client, message, args) => {
	if (!client.config.trusted.includes(message.author.id)) return;
	const ms = require("ms");
	const end = () => {
		client.destroy();
		process.exit(0);
	};

	if (args[0] && !isNaN(ms(args[0]))) {
		await message.channel.send(`I'll be restarting at ${new Date(Date.now()+ms(args[0])).toLocaleString()}, if that's alright with you.`);
		client.setTimeout(end, ms(args[0]), client);
		return;
	}
	
	await message.channel.send("I'll be restarting now, if that's alright with you.");
	end();
};

exports.conf = {
	aliases: ["die", "kill"],
	requires: ["SEND_MESSAGES"]
};

exports.help = {
	name: "restart",
	category: "System",
	description: "Restart the bot.",
	usage: "restart",
	example: "restart"
};
