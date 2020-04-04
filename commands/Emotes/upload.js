exports.run = async (client, message, args) => { // eslint-disable-line no-unused-vars

	const { embed } = client.utils.emotes;
	
	const regName = /^[_a-z0-9]{2,32}$/i;
	const regLink = /^https?:\/\//;

	const file = message.attachments.first();
	
	let name = (args[0] && regName.test(args[0])) ? args[0] : undefined;
	let link = (name && args[1] && regLink.test(args[1])) ? args[1] : undefined;

	if(file){ // Alright, let's start using the attachment.
		if(!(file.size <= 256000 && /\.(gif|png|jpg|jpeg|webp)$/.test(file.url))) return message.channel.send("That's an invalid attachment (over 256 KB or not an image)!");
		if(regName.test(file.name)) name = file.name;
		link = file.url;
	}
	
	if(!link) return message.channel.send("You didn't provide a valid link or attachment."); // Did we get a link?
	if(!name) return message.channel.send("You didn't provide a valid name emote name!"); // Is the name valid?

	message.guild.emojis.create(link, name, {reason: `Added by ${message.author.tag}`})
		.then(emote => message.channel.send(embed(emote, message)))
		.catch(err => {
			console.log(err);
			message.channel.send("There was an error! Your link might have been an invalid image.");
		});
};

exports.conf = {
	aliases: ["add"],
	requires: ["SEND_MESSAGES", "MANAGE_EMOJIS", "EMBED_LINKS"]
};

exports.help = {
	name: "upload",
	category: "Emotes",
	description: "Add an emote to the server with either a link or attachment.",
	usage: "upload [name] (link/attachment)",
	example: "upload placeholder https://via.placeholder.com/150"
};
