exports.run = async (client, message, args) => {
	const ms = require("ms");
	const { RichEmbed } = require("discord.js");
	if(!args.includes("in")) return message.channel.send("Please follow the reminder format!");
	const [reminder, duration] = args.join(" ").split(" in ");
	if(!duration || !ms(duration)) return message.channel.send("That is not a valid format.");
	client.setTimeout(() => {
		client.users.get(message.author.id).send(`Reminder!\n> ${reminder}`);
	}, ms(duration), client, message.author.id, reminder);
	const embed = new RichEmbed()
		.setTitle("Reminder")
		.setDescription(`I'll remind you on ${new Date(Date.now()+ms(duration)).toLocaleString()}.\n\`\`\`${reminder}\`\`\``)
		.setColor(message.guild.me.displayColor)
		.setThumbnail("https://cdn.discordapp.com/emojis/478393538980347924.png")
		.setTimestamp(new Date(Date.now()+ms(duration)).toISOString())
		.setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL);
	message.channel.send(embed);
};

exports.conf = {
	aliases: ["remind"],
	requires: ["SEND_MESSAGES"]
};

exports.help = {
	name: "remindme",
	category: "Guild",
	description: "Reminds you about something.",
	usage: "remindme [reminder...] in [time]",
	example: "remindme to check the cookies in 3 minutes"
};