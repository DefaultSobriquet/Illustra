// eslint-disable-next-line no-unused-vars
exports.run = async (client, message, args) => {
	const emoteUtils = client.utils.emotes;
	if(!args[0]){
		message.channel.send("Please enter a message ID!");	
		return;
	}
	const id = args[0];
	const target = await message.channel.fetchMessage(id).catch(() => {
		message.channel.send("I could not get that message.");
	});
	if(target === undefined) return;
	const emotes = emoteUtils.extract(target);
	let props;
	const status = await message.channel.send("**Emote Status**\n```pl\n# Awaiting...```");
	let list = "";
	if(emotes.length == 0){
		status.edit("**Emote Status**\n```pl\n# I couldn't find any emotes in that message.```");
		return;
	}
	while(emotes.length > 0){
		props = emoteUtils.props(emotes.shift());
		message.guild.createEmoji(props.url,props.name,[],`Obtained with ${client.config.name}`).then(
			emote => {
				status.edit(`**Emote Status**\n\`\`\`pl\n${list+=`[ID ${emote.id}] > # ${emote.name}\n`}\`\`\``);
			}
		).catch((err) => {
			status.edit(`**Emote Status**\n\`\`\`pl\n${list+= `[Error - ${err.code}] > # ${props.name}`}\`\`\``);
		});
	}
};
 
exports.conf = {
	aliases: ["add"],
	permLevel: 0,
	requires:["SEND_MESSAGES","VIEW_CHANNEL","MANAGE_EMOJIS","READ_MESSAGE_HISTORY"]
};

exports.help = {
	name: "obtain",
	category: "Emotes",
	description: "Retrieve custom emotes from a message and add it to the server.",
	usage: "obtain (message id)",
	example: "obtain 29394959239030102"
};