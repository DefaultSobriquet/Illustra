exports.run = async (client, message, args) => {
	const {Util} = require("discord.js");
	if (!client.config.trusted.includes(message.author.id)) return;
	if (!args[0]) return message.channel.send("Please enter an input.");
	try {
		let output = "No output.";
		require("child_process").exec(args.join(" "), (err, stdout, stderr) => {
			if (err) output = err.stack;
			if (stdout && stdout.length !== 0) output = stdout;
			if (stderr && stderr.length !== 0) output = stderr;
			const messages = Util.splitMessage(output);
			if (typeof (messages) === "string") return message.channel.send(`\`\`\`bash\n${messages}\`\`\``);
			messages.forEach((value) => message.channel.send(`\`\`\`bash\n${value}\`\`\``));
		});
	} catch (err) {
		message.channel.send(`\`\`\`${err}\`\`\``);
	}
};

exports.conf = {
	aliases: ["ex", "exe", "exec"],
	requires: ["SEND_MESSAGES"],
};

exports.help = {
	name: "execute",
	category: "System",
	description: "Executes a command",
	usage: "exec [...command]",
	example: "exec pm2 stop Illustra",
};
