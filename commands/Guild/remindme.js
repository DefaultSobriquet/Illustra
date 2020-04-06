exports.run = async (client, message, args, flags) => { // eslint-disable-line no-unused-vars
	const ms = require("ms");
	const {MessageEmbed} = require("discord.js");

	if (!args.includes("in")) return message.channel.send("Please follow the reminder format!");
	
	const reminderArray = args.join(" ").split(" in ");
	const duration = reminderArray.pop();
	const reminder = reminderArray.join(" in ");
	
	if (!duration || !ms(duration)) return message.channel.send("That is not a valid format.");
	
	client.setTimeout(() => {
		client.users.fetch(message.author.id)
			.then(user => {
				user.send(`Reminder!\n> ${reminder}`).catch();
			});
	}, ms(duration), client, message.author.id, reminder);
	
	const embed = new MessageEmbed()
		.setTitle("Reminder")
		.setDescription(`I'll remind you on ${new Date(Date.now()+ms(duration)).toLocaleString()}.\n\`\`\`${reminder}\`\`\``)
		.setColor(message.guild.me.displayColor)
		.setThumbnail("https://cdn.discordapp.com/emojis/478393538980347924.png")
		.setTimestamp(new Date(Date.now()+ms(duration)).toISOString())
		.setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL());
	
	message.channel.send(embed);
};

exports.conf = {
	aliases: ["remind"],
	perms: [], 
	requires: ["SEND_MESSAGES"]
};

exports.help = {
	name: "remindme",
	category: "Guild",
	description: "Reminds you about something.",
	usage: "remindme [reminder...] in [time]",
	example: "remindme to check the cookies in 3 minutes"
};
