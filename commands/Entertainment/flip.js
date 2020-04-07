exports.run = async (client, message, args, flags) => { // eslint-disable-line no-unused-vars
	message.channel.send(["`Heads!`", "`Tails!`"][Math.floor(Math.random() * 2)]);
};

exports.conf = {
	aliases: ["coin", "coinflip"],
	perms: [], 
	requires: ["SEND_MESSAGES"]
};

exports.help = {
	name: "flip",
	category: "Entertainment",
	description: "Flip a coin.",
	usage: "flip",
	example: "flip"
};
