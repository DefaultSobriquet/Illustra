exports.run = async (client, message, args) => {
	const { props, embed } = client.utils.emotes;
	let emote;
	if(/<?(a:)?(\w{2,32}):(\d{17,19})>?/.test(args[0])) emote = props(args[0]);
	if(!emote) emote = client.utils.emotes.resolve(args[0],message);
	if(!emote) return message.channel.send("Please enter an emote.");
	message.channel.send(embed(emote,message));
};

exports.conf = {
	aliases: [],
	permLevel: 0,
	userRequires: ["SEND_MESSAGES"],
	requires: ["SEND_MESSAGES"]
};

exports.help = {
	name: "emote",
	category: "Emotes",
	description: "Get information about an emote.",
	usage: "emote [emote]",
	example: "emote :rooThink:"
};