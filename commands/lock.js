exports.run = async (client, message, args) => {
	const { RichEmbed } = require("discord.js");
	const { resolve, menuGenerator } = client.utils.emotes;
	const emote = resolve(args[0], message);
	let roles = args.slice(1).map(role => client.utils.roles.resolve(role, message)).filter(role => !role ? false : true);
	const integrated = message.guild.me.roles.find(role => role.managed);
	if(!emote) return message.channel.send("I could not find the emote provided.");
	if(roles.length === 0) return message.channel.send("You didn't specify any valid roles!");
	if(integrated) roles.push(integrated);
	roles = [...new Set(roles)];
	const embed = new RichEmbed()
		.setTitle(`Lock Emote [${emote.name}]`)
		.setTimestamp()
		.setImage(emote.url)
		.setColor(message.guild.me.displayColor)
		.setDescription(`**Roles**: ${roles.join(", ")}`)
		.setFooter(`${message.author.tag}`, message.author.avatarURL);
	const menu = await message.channel.send((integrated) ? "" : `Warning! ${client.config.name} does not have an integrated role and will no longer be able to use this emote.`, embed);
	const reactions = ["🔒", "🛑"];
	const reactMenu = await menuGenerator(reactions, menu, message.author.id);
	reactMenu.on("collect", (reaction, collector) => {
		if(reaction.emoji.name === "🔒"){
			emote.addRestrictedRoles(roles)
				.then(emote => message.channel.send(`> 🔒  | [ID \`\`${emote.id}\`\`] — \`\`${emote.name}\`\``))
				.catch((err) => {
					if(err.code === 50013) return message.channel.send("> There was a permissions error! Please make sure the correct permissions are granted.");
					message.channel.send("> There was a unexpected error.");
				});
		}
		collector.stop();
	});
};
 
exports.conf = {
	aliases: ["restrict"],
	requires: ["SEND_MESSAGES", "MANAGE_EMOJIS", "MANAGE_MESSAGES", "ADD_REACTIONS"]
};

exports.help = {
	name: "lock",
	category: "Emotes",
	description: "Lock an emote to specific roles.",
	usage: "lock [emote] [...role]",
	example: "lock <:rooThink:511919341281738773> Pandas"
};