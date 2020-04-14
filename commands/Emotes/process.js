const jimp = require("jimp");
exports.run = async (client, message, args, flags) => { // eslint-disable-line no-unused-vars
	const {embed, resolve, props, space} = client.utils.emotes;

	const server = space(message);
	if(!server.static && !flags.includes("replace")) return message.channel.send(`You don't have a static emote slot out of ${server.limit}!`);
	
	const emote = /<?(a:)?(\w{2,32}):(\d{17,19})>?/.test(args[0]) ? props(args[0]) : resolve(args.join("_"), message);
	if(!emote) return message.channel.send("I couldn't find a valid emote!");
	if(emote.animated) return message.channel.send("I can't process animated emotes!");
	if(flags.includes("replace") && emote.guild && emote.guild.id === message.guild.id) emote.delete();
	try{
		message.channel.startTyping();
		const image = await jimp.read(emote.url);

		image.flip(flags.includes("fliph"), flags.includes("flipv"));
		if(flags.includes("grey")) image.greyscale();
		if(flags.includes("blur")) image.blur(1);
		if(flags.includes("invert")) image.invert();
		if(flags.includes("pixelate")) image.pixelate(2);
		
		const processedURI = await image.getBase64Async(jimp.AUTO);
		const processedEmote = await message.guild.emojis.create(processedURI, flags.includes("replace") ? emote.name : `NEW${emote.name.slice(0, 29)}`, {
			reason: `${emote.name} to greyscale by ${message.author.tag}`,
			roles: (emote.roles && emote.roles.cache.size) ? emote.roles.cache : []
		});
		
		message.channel.send(embed(processedEmote, message));
		

	}catch(err){
		message.channel.send("There was an unexpected error!");
		console.log(err);
	}
	
	message.channel.stopTyping();	
};

exports.conf = {
	aliases: [],
	perms: ["MANAGE_EMOJIS"], 
	requires: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_EMOJIS"]
};

exports.help = {
	name: "process",
	category: "Emotes",
	description: "Process an emote and add it to the guild.",
	usage: "process [emote]",
	example: "process :rooThink:"
};
