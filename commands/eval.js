exports.run = async (client, message, args) => {
	const code = args.join(" "); // Generate string input.
	if (code.includes("client.token")) return message.channel.send("No thanks."); // Prevent attempts to get the token.
	try {
		const evaled = eval(code); // Evaluate the code
		const clean = await client.clean(client, evaled); // Clean the code
		if (clean.length > 2040) {
			// message.channel.send("The evaled code is too large! Check the console."); // We need to add a splitter sometime.
			
		} else {
			message.channel.send({
				embed: {
					color: message.guild.me.displayColor,
					title: "Here's your evaled code!",
					timestamp:new Date().toISOString(),
					description: `\`\`\`js\n${clean}\n\`\`\``,
					footer:{
						text:`${client.config.description}`
					}
				}
			});
		}
		console.log(`Eval results: ${clean}`);
	} catch (err) {
		message.channel.send(`\`ERROR\` \`\`\`xl\n${await client.clean(client, err)}\n\`\`\``);
	}
};

exports.conf = {
	aliases: ["e", "evaluate"],
	permLevel: 10,
	requires:["SEND_MESSAGES"]
};

exports.help = {
	name: "eval",
	category: "System",
	description: "Evaluates arbitrary javascript.",
	usage: "eval [...code]",
	example: "eval message.reply('No')"
};