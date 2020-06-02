import { Message, Util } from "discord.js";

exports.run = async (client: any, message: Message, args: string[], flags: string[]) => { // eslint-disable-line no-unused-vars
	if (!client.config.trusted.includes(message.author.id)) return;

	if (!args[0]) return message.channel.send("Please enter an input.");
	
	try {
		let output = "No output.";
		//@ts-ignore I should probably look up the types for this.
		require("child_process").exec(args.join(" "), (err, stdout, stderr) => {
			if (err) output = err.stack;
			if (stdout && stdout.length !== 0) output = stdout;
			if (stderr && stderr.length !== 0) output = stderr;
			const messages = Util.splitMessage(output);
			if (typeof (messages) === "string") return message.channel.send(`\`\`\`bash\n${messages}\`\`\``);
			messages.forEach((value) => message.channel.send(`\`\`\`bash\n${value}\`\`\``));
		});
	} catch (err) {
		message.channel.send(`\`\`\`bash\n${err}\`\`\``);
	}
};

exports.conf = {
	aliases: ["ex", "exe", "exec"],
	perms: [], 
	requires: ["SEND_MESSAGES"]
};

exports.help = {
	name: "execute",
	category: "System",
	description: "Executes a command",
	usage: "exec [...command]",
	example: "exec pm2 stop Illustra"
};
