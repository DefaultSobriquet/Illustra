exports.run = async (client, message, args, flags) => { // eslint-disable-line no-unused-vars
	const {extract, props} = client.utils.emotes;
	const {MessageEmbed} = require("discord.js");

	let target;

	if(args.some(arg => /<?(a:)?(\w{2,32}):(\d{17,19})>?/.test(arg))) target = message;

	if (!target && args[0] && /^\d{17,19}$/.test(args[0])) target = await message.channel.messages.fetch(args[0], true)
		.catch(() => {
			message.channel.send("I could not get that message. Are you in the same channel?");
		});

	if (!target) return message.channel.send("Please provide either a message ID or emotes as arguments!");

	const emotes = extract(target).map((emote) => props(emote));

	if(!emotes.length) return message.channel.send("I couldn't find any emotes!");
	
	const embed = new MessageEmbed()
		.setTitle("Obtaining Status")
		.setAuthor(message.guild.name, message.guild.iconURL())
		.setColor(message.guild.me.displayColor)
		.setTimestamp()
		.setDescription(`${emotes.length} emote${emotes.length >=1 ? "s" : ""} found — now adding.`)
		.addField("Message", `[Jump!](${target.url})`, true)
		.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());

	const status = await message.channel.send(embed);
	
	const success = [];
	const failed = [];

	message.channel.startTyping();

	for (const emote of emotes) {
		await message.guild.emojis.create(emote.url, emote.name, {reason: `Obtained by ${message.author.tag}!`})
			.then((e) => success.push(e))
			.catch(() => {
				failed.push(emote);
				status.edit(`There was a unexpected error for ${emote.name}! The emote may have been a legacy emote above 256KB.`);
			});
	}

	embed.setDescription(success.join(" | "));
	if(failed.length) embed.addField("Failed to Add", failed.map(e => `\`${e.name}\``).join(" | "), true);

	status.edit(`Completed! I've added ${success.length}/${emotes.length} of your requested emotes.`, embed).finally(message.channel.stopTyping(true));

};

exports.conf = {
	aliases: ["steal"],
	perms: ["MANAGE_EMOJIS"], 
	requires: ["SEND_MESSAGES", "VIEW_CHANNEL", "MANAGE_EMOJIS", "READ_MESSAGE_HISTORY"]
};

exports.help = {
	name: "obtain",
	category: "Emotes",
	description: "Add custom emotes from a message to the server.",
	usage: "obtain [message id | emotes...]",
	example: "obtain 29394959239030102"
};
