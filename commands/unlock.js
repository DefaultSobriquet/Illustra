exports.run = async (client, message, args) => {
	const { RichEmbed } = require("discord.js");
	const { resolve, menuGenerator } = client.utils.emotes;
	const emote = resolve(args[0],message);
	if(!emote) return message.channel.send("I could not find the emote provided.");
	if(emote._roles.length === 0) return message.channel.send(`> ${emote}  | There are no roles bound to \`\`${emote.name}\`\`!`);
	const embed = new RichEmbed()
		.setTitle(`Unlock Emote [${emote.name}]`)
		.setTimestamp()
		.setDescription(`**Current Roles**: ${emote._roles.map(role => client.utils.roles.resolve(role,message)).map(role => !role ? "Invalid Role" : role).join(", ")}`)
		.setImage(emote.url)
		.setColor(message.guild.me.displayColor)
		.setFooter(`${message.author.tag}`, message.author.avatarURL);
	const menu = await message.channel.send(embed);
	const reactions = ["🔓","🛑"];
	const reactMenu = await menuGenerator(reactions, menu, message.author.id);
	reactMenu.on("collect", (reaction,collector) => {
		if(reaction.emoji.name === "🔓"){
			emote.edit({roles: []},`Unlocked by ${message.author.tag} using ${client.config.name}.`)
				.then(emote => message.channel.send(`> 🔓  | [ID \`\`${emote.id}\`\`] — \`\`${emote.name}\`\``))
				.catch((err) => {
					if(err.code === 50013) return message.channel.send("> There was a permissions error! Please make sure the correct permissions are granted.");
					message.channel.send("> There was a unexpected error.");
				});
		}
		collector.stop();
	});
};
 
exports.conf = {
	aliases: ["unrestrict"],
	permLevel: 0,
	userRequires: ["SEND_MESSAGES"],
	requires: ["SEND_MESSAGES"]
};

exports.help = {
	name: "unlock",
	category: "Emotes",
	description: "Lock an emote to specific roles.",
	usage: "unlock [emote]",
	example: "unlock <:rooThink:511919341281738773>"
};