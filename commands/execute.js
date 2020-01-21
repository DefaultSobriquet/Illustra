exports.run = async (_client, message, args) => {
	if(!args[0]) return message.channel.send("Please enter an input."); 
	try {
		let output = "No output.";
		require("child_process").exec(args.join(" "), (err, stdout, stderr) => {
			if (err) {
				output = err.stack;
			}
			if (stdout && stdout.length !== 0) {
				output = stdout;
			}
			if (stderr && stderr.length !== 0) {
				output = stderr;
			}
			message.channel.send(`\`\`\`${output}\`\`\``);
		});
	} catch (err) {
		message.channel.send(`\`\`\`${err}\`\`\``);
	}
};
  
exports.conf = {
	aliases: ["ex", "exe", "exec"],
	permLevel: 10,
	userRequires: ["SEND_MESSAGES"],
	requires: ["SEND_MESSAGES"]
};
  
exports.help = {
	name: "execute",
	category: "System",
	description: "Executes a command",
	usage: "exec [...command]",
	example: "exec pm2 stop Illustra"
};