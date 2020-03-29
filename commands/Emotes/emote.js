exports.run = async (client, message, args) => {
	const {props, embed, resolve} = client.utils.emotes;
	let emote;
	if (/<?(a:)?(\w{2,32}):(\d{17,19})>?/.test(args[0])) emote = props(args[0]);
	if (!emote) emote = resolve(args[0], message);
	if (!emote) return message.channel.send("Please enter a valid emote.");
	message.channel.send(embed(emote, message));
};

exports.conf = {
	aliases: [],
	requires: ["SEND_MESSAGES"],
};

exports.help = {
	name: "emote",
	category: "Emotes",
	description: "Get information about an emote.",
	usage: "emote [emote]",
	example: "emote :rooThink:",
};
