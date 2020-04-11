const GuildModel = require("../../models/Guild.js");
exports.run = async (client, message, args, flags) => { // eslint-disable-line no-unused-vars
	let guild = await GuildModel.findOne({id: message.guild.id});
	if(!guild) return message.channel.send("Database does not have document reference. Please reinvite me and try again.");
	if(!args[0]){
		message.channel.send(`Your guild's prefix is \`${guild.prefix}\`.`);
	}else{
		if(args[0].length > 5) return message.channel.send("You must specify a prefix with a max of five characters!");
		guild = await GuildModel.findOneAndUpdate({id: message.guild.id}, {$set: {prefix: args[0]}}, {new: true});
		message.channel.send(`\`${args[0]}\` is now your prefix!`);
	}
};

exports.conf = {
	aliases: [],
	perms: ["MANAGE_GUILD"], 
	requires: ["SEND_MESSAGES"]
};

exports.help = {
	name: "prefix",
	category: "Guild",
	description: "Sets or resets the guild prefix.",
	usage: "prefix (prefix)",
	example: "prefix !!"
};
