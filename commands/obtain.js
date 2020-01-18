// eslint-disable-next-line no-unused-vars
exports.run = async (client, message, args) => {
	
	const {extract , embed, props , obtain} = client.utils.emotes;

	if(!args[0]) return message.channel.send("Please enter a message ID!");	
	
	const id = args[0];
	
	const target = await message.channel.fetchMessage(id).catch(() => {
		message.channel.send("I could not get that message.");
	});
	
	if(target === undefined) return;

	const emotes = extract(target);
	
	if(emotes.length == 0) return message.channel.send("I couldn't find any emotes in that message.");

	let page = 0;	
	let saved = [];
	const reactions = ["⏮️","⬅️","➡️","⏭️","💾"];

	
	const menu = await message.channel.send(embed(props(emotes[page]),target));
	
	const reactMenu = menu.createReactionCollector(
		(reaction,user) => (message.author.id === user.id) && reactions.includes(reaction.emoji.name),
		{time:120000}
	);

	reactMenu.on("collect", async (reaction,collector) => {
		reaction.remove(message.author);
		if(reaction.emoji.name == "➡️" && page < emotes.length-1) menu.edit(embed(props(emotes[++page]),target));
		if(reaction.emoji.name == "⬅️" && page > 0) menu.edit(embed(props(emotes[--page]),target));
		if(reaction.emoji.name == "⏮️" && page !== 0) menu.edit(embed(props(emotes[page = 0]),target));
		if(reaction.emoji.name == "⏭️" && page !== emotes.length-1) menu.edit(embed(props(emotes[page = emotes.length-1]),target));
		if(reaction.emoji.name == "💾"){
			const emoteLimit = [50,100,150,250][message.guild.premiumTier];
			if((message.guild.emojis.filter(emote => (emote.animated == props(emotes[page]))).size >= 25 && emoteLimit === 50) && message.guild.emojis.size >= emoteLimit){
				collector.stop();
				return message.channel.send(`You have reached the guild limit [${emoteLimit}] for emotes!`);
			}
			obtain(props(emotes[page]),target).then(emote => {
				message.channel.send(`> ${emote}  | [ID \`\`${emote.id}\`\`] — \`\`${emote.name}\`\``);
				saved.push(emote);
			}).catch((err) => {
				if(err.code === 50013){
					collector.stop();
					return message.channel.send("> There was a permissions error! Please make sure the correct permissions are granted.");
				}
			});
		}
	});

	reactMenu.on("end", () => {
		reactMenu.message.clearReactions();
	});

	for(let index in reactions){
		await menu.react(reactions[index]);
	}

};
 
exports.conf = {
	aliases: ["add"],
	permLevel: 0,
	userRequires:["SEND_MESSAGES","MANAGE_EMOJIS"],
	requires:["SEND_MESSAGES","VIEW_CHANNEL","MANAGE_EMOJIS","READ_MESSAGE_HISTORY","MANAGE_MESSAGES","ADD_REACTIONS"]
};

exports.help = {
	name: "obtain",
	category: "Emotes",
	description: "Retrieve custom emotes from a message and add it to the server.",
	usage: "obtain (message id)",
	example: "obtain 29394959239030102"
};