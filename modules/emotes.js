module.exports = (client) => {
	const { RichEmbed } = require("discord.js");
	client.utils.emotes = {
		resolve: (input, message) => {
			if(!input) return;
			let emote = message.guild.emojis.find(emote => input.includes(`${emote.name}:${emote.id}`));
			if(emote == null) emote = message.guild.emojis.find(emote => emote.id === input);
			if(emote == null) emote = message.guild.emojis.find(emote => emote.name === input);
			if(emote == null) emote = message.guild.emojis.find(emote => emote.name.startsWith(input));
			if(emote == null) emote = message.guild.emojis.find(emote => emote.name.toLowerCase().startsWith(input.toLowerCase()));
			return emote;
		},
		search: (input, message) => {
			return message.guild.emojis.filter(emote => !input || input.includes(`${emote.name}:${emote.id}`) || input.includes(emote.id)
			|| emote.name.includes(input) || emote.name.toLowerCase().includes(input.toLowerCase()));
		},
		props: (input) => {
			const emote = input.match(/<?(a:)?(\w{2,32}):(\d{17,19})>?/);
			if(client.emojis.has(emote[3])) return client.emojis.get(emote[3]);
			return {animated: Boolean(emote[1]), name: emote[2], id: emote[3], url: `https://cdn.discordapp.com/emojis/${emote[3]}.${emote[1] ? "gif" : "png"}`};
		},
		extract: (message, allowGuild = false) => {
			let emotes = message.content.match(/<(a*):(.*?)>/g);
			if(!emotes) return [];
			emotes = [...new Set(emotes)]; // Filter emote duplicates
			if(!allowGuild) emotes = emotes.filter((emote) => !message.guild.emojis.has(emote.split(":")[2].replace(">", "")));
			return emotes;
		},
		obtain: (props, message) => {
			return message.guild.createEmoji(props.url, props.name, [], `Obtained by ${message.author.tag}`);
		},
		embed: (props, message) => {
			const embed = new RichEmbed()
				.setTitle(`${props.animated ? "Animated" : "Still"} Emote - ${props.name}`)
				.setTimestamp((props.guild) ? props.createdAt : message.createdAt)
				.setColor(message.guild.me.displayColor)
				.setDescription(`**ID**: ${props.id}\n**Link**: [Click here](${props.url})`)
				.setImage(`${props.url}?size=2048`)
				.setFooter(props.guild ? `${props.guild.name} | Created` : `${message.author.tag}`, (props.guild) ? props.guild.iconURL : message.author.avatarURL);
			return embed;
		},
		menuGenerator: async (reactions, message, author) => {
			const reactMenu = message.createReactionCollector(
				(reaction, user) => (author === user.id) && reactions.includes(reaction.emoji.name),
				{time: 120000}
			);
			reactMenu.on("collect", (reaction) => reaction.remove(author).catch());
			reactMenu.on("end", () => reactMenu.message.clearReactions().catch());
			for(let index in reactions){
				await message.react(reactions[index]).catch();
			}
			return reactMenu;
		},
		addable: async (message, props) => {
			const emoteLimit = [50, 100, 150, 250][message.guild.premiumTier];
			const emotes = message.guild.emojis;
			if(emoteLimit === 50) return (emotes.filter(emote => (emote.animated === props.animated)).size < 25);
			return (emotes.size < emoteLimit);
		}
	};
};