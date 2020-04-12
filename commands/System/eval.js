const {Util} = require("discord.js");
exports.run = async (client, message, args, flags) => { // eslint-disable-line no-unused-vars
	if (!client.config.trusted.includes(message.author.id)) return;
	const code = args.join(" "); // Generate string input.

	if (code.includes("client.token")) return message.channel.send("No thanks."); // Prevent attempts to get the token.
	
	try {
		const evaled = await (code.includes("await") ? eval("async function foo(){" + code + "}; foo()") : eval(code)); // Evaluate the code
		const clean = client.clean(client, evaled); // Clean the code
		const messages = Util.splitMessage(clean);
		if (typeof (messages) === "string") return message.channel.send(`\`\`\`js\n${messages}\`\`\``);
		messages.forEach((value) => message.channel.send(`\`\`\`js\n${value || "No output."}\`\`\``));
	} catch (err) {
		message.channel.send(`\`ERROR\` \`\`\`xl\n${client.clean(client, err)}\n\`\`\``);
	}
};

exports.conf = {
	aliases: ["e", "evaluate"],
	perms: [],
	flags: [], 
	requires: ["SEND_MESSAGES"]
};

exports.help = {
	name: "eval",
	category: "System",
	description: "Evaluates arbitrary javascript.",
	usage: "eval [...code]",
	example: "eval message.reply('No')"
};
