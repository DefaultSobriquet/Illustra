import { Message } from "discord.js";

export const run = async (client: any, message: Message, args: string[], flags: string[]) => { // eslint-disable-line no-unused-vars
	const { embed, props, space } = client.utils.emotes;
	
	const {a, s} = space(message);
	const regName = /^[_a-z0-9]{2,32}$/i;
	const regLink = /^https?:\/\//;

	const file = message.attachments.first();
	
	let name = (args[0] && regName.test(args[0])) ? args[0] : undefined;
	let link = (name && args[1] && regLink.test(args[1])) ? args[1] : undefined;

	if(file){ // Alright, let's start using the attachment.
		if(!(file.size <= 256000 && /\.(gif|png|jpg|jpeg|webp)$/.test(file.url))){
			return message.channel.send("That's an invalid attachment (over 256 KB or not a valid image)!");
		}
		
		if(!a && /\.gif$/.test(file.url)) return message.channel.send("You don't have space for an animated emote!");
		if(!s && /\.(png|jpg|jpeg|webp)$/.test(file.url)) return message.channel.send("You don't have space for an static emote!");

		if(regName.test(file.name ?? "")) name = file.name;
		link = file.url;
	}

	if(!link && /<?(a:)?(\w{2,32}):(\d{17,19})>?/.test(args[1])) link = props(args[1]).url;

	if(!name) return message.channel.send("You didn't provide a valid name emote name!"); // Is the name valid?
	if(!link) return message.channel.send("You didn't provide a valid link, emote, or attachment."); // Did we get a link?

	message!.guild!.emojis.create(link, name, {reason: `Added by ${message.author.tag}`})
		.then(emote => message.channel.send(embed(emote, message)))
		.catch(err => {
			console.log(err);
			message.channel.send("There was an error! Your link might have been an invalid image.");
		});
};

export const conf = {
	aliases: ["add"],
	perms: ["MANAGE_EMOJIS"], 
	requires: ["SEND_MESSAGES", "MANAGE_EMOJIS", "EMBED_LINKS"]
};

export const help = {
	name: "upload",
	category: "Emotes",
	description: "Add an emote to the server with either a link, emote, or attachment.",
	usage: "upload [name] (link/attachment/emote)",
	example: "upload placeholder https://via.placeholder.com/150"
};