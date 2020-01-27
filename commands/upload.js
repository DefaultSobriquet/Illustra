exports.run = async (client, message, args) => {
	const { embed } = client.utils.emotes;
	if(args.length && !/^[_a-z0-9]{2,32}$/i.test(args[0])) return message.channel.send("That is not a valid emote name! It must be alphanumerical, with at least two characters.");
	if(message.attachments.size > 0){
		const file = message.attachments.first();
		if(file.filesize <= 256000 && /\.(gif|png|jpg|jpeg|webp)$/.test(file.url)){
			if(!/^[_a-z0-9]{2,32}$/i.test(file.filename.split(".")[0])) return message.channel.send(`Your filename [${file.filename.split(".")[0]}] is not a valid emote name! It must be alphanumerical, with at least two characters.`);
			message.guild.createEmoji(file.url, args.length ? args[0] : file.filename.split(".")[0], [], `Added by ${message.author.tag}`)
				.then(emote => {
					message.channel.send(embed(emote, message));
				})
				.catch(err => {
					console.log(err);
					message.channel.send("There was an unexpected error!");
				});
			return;
		}
		message.channel.send("The uploaded file was invalid! It may have been over 256 KB or of an incompatible file type.");
		return;
	}else if(args.length > 1 && /^https?:\/\//.test(args[1])){
		message.guild.createEmoji(args[1], args[0], [], `Added by ${message.author.tag}`)
			.then(emote => {
				message.channel.send(embed(emote, message));
			})
			.catch(err => {
				console.log(err);
				message.channel.send("The provided link was invalid! It may have been over 256 KB or of an incompatible file type.");
			});
		return;
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
	description: "Add an emote to the server.",
	usage: "upload [name] [link]",
	example: "upload placeholder https://via.placeholder.com/150"
};