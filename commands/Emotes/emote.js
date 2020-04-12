exports.run = async (client, message, args, flags) => { // eslint-disable-line no-unused-vars
	const {props, embed, resolve} = client.utils.emotes;
	const emote = /<?(a:)?(\w{2,32}):(\d{17,19})>?/.test(args[0]) ? props(args[0]) : resolve(args.join("_"), message);
	if (!emote) return message.channel.send("Please enter a valid emote.");
	message.channel.send(embed(emote, message));
};

exports.conf = {
	aliases: ["emoji"],
	perms: [],
	flags: [], 
	requires: ["SEND_MESSAGES", "EMBED_LINKS"]
};

exports.help = {
	name: "emote",
	category: "Emotes",
	description: "Get information about an emote.",
	usage: "emote [emote]",
	example: "emote :rooThink:"
};
