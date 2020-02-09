exports.run = async (client, message, args) => {
	const { embed, props, obtain } = client.utils.emotes;
	if(args.length && !/^[_a-z0-9]{2,32}$/i.test(args[0])) return message.channel.send("That is not a valid emote name! It must be alphanumerical, with at least two characters."); // Emote name check
	if(message.attachments.size > 0){
		const file = message.attachments.first();
		if(file.filesize <= 256000 && /\.(gif|png|jpg|jpeg|webp)$/.test(file.url)){
			const name = file.filename.split(".")[0];
			if(!args[0] && !/^[_a-z0-9]{2,32}$/i.test(name)) return message.channel.send(`Your filename [${name}] is not a valid emote name! It must be alphanumerical, with at least two characters.`);
			message.guild.createEmoji(file.url, args.length ? args[0] : name, [], `Added by ${message.author.tag}`)
				.then(emote => {
					message.channel.send(embed(emote, message));
				})
				.catch(() => {
					message.channel.send("There was an unexpected error!");
				});
			return;
		}
		message.channel.send("The uploaded file was invalid! It may have been over 256 KB or of an incompatible file type.");
		return;
	}else if(args.length > 1){
		if(/<?(a:)?(\w{2,32}):(\d{17,19})>?/.test(args[1])){
			const emote = props(args[1]);
			obtain(emote, message).then(emote => {
				message.channel.send(embed(emote, message));
			}).catch(() => {
				message.channel.send(`There was a unexpected error for ${emote.name}! The emote may have been a legacy emote above 256KB.`);
			});
			return;
		}else if(/^https?:\/\//.test(args[1])){ 
			message.guild.createEmoji(args[1], args[0], [], `Added by ${message.author.tag}`)
				.then(emote => {
					message.channel.send(embed(emote, message));
				})
				.catch(() => {
					message.channel.send("The provided link was invalid! It may have been over 256 KB or of an incompatible file type.");
				});
			return;
		}
	}
	message.channel.send("Please enter a name and link, or upload a file!");
};

exports.conf = {
	aliases: [],
	requires: ["SEND_MESSAGES", "MANAGE_EMOJIS", "MANAGE_MESSAGES", "ADD_REACTIONS"]
};

exports.help = {
	name: "upload",
	category: "Emotes",
	description: "Add an emote to the server with either a link or attachment.",
	usage: "upload [name] (link/attachment)",
	example: "upload placeholder https://via.placeholder.com/150"
};