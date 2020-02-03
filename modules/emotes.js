module.exports = (client) => {
	const { RichEmbed } = require("discord.js");
	client.utils.emotes = {
		resolve: (input, message) => {
			if(!input) return null; 
			let emote = message.guild.emojis.find(emote => input.includes(`${emote.name}:${emote.id}`)); 
			if(emote == null) emote = message.guild.emojis.find(emote => emote.id === input); 
			if(emote == null) emote = message.guild.emojis.find(emote => emote.name === input); 
			if(emote == null) emote = message.guild.emojis.find(emote => emote.name.toLowerCase() === input.toLowerCase()); 
			if(emote == null) emote = message.guild.emojis.find(emote => emote.name.startsWith(input)); 
			if(emote == null) emote = message.guild.emojis.find(emote => emote.name.toLowerCase().startsWith(input.toLowerCase())); 
			return emote;
		},
		search: (input, message) => {
			if(!input) return message.guild.emojis;
			return message.guild.emojis.filter(emote => 
				!input || input.includes(`${emote.name}:${emote.id}`) 
				|| input.includes(emote.id) || emote.name.includes(input) 
				|| emote.name.toLowerCase().includes(input.toLowerCase())
			);
		},
		props: (input) => {
			const emote = input.match(/<?(a:)?(\w{2,32}):(\d{17,19})>?/); // RegEx extractor for emote input
			if(client.emojis.has(emote[3])) return client.emojis.get(emote[3]); // If emote already exists in client, return it instead
			return { 
				animated: Boolean(emote[1]),
				name: emote[2], id: emote[3],
				url: `https://cdn.discordapp.com/emojis/${emote[3]}.${emote[1] ? "gif" : "png"}`
			};
		},
		extract: (message, allowGuild = false) => { 
			let emotes = message.content.match(/<(a*):(.*?)>/g); 
			if(!emotes) return []; 
			emotes = [...new Set(emotes)]; 
			if(!allowGuild) emotes = emotes.filter((emote) => !message.guild.emojis.has(emote.split(":")[2].replace(">", ""))); // If no guilds allowed, filter guild duplicates
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
				.setDescription(`**ID**: ${props.id}\n**Link**: [Image URL](${props.url})`)
				.setImage(props.url)
				.setFooter(props.guild ? `${props.guild.name} | Created` : message.author.tag, (props.guild) ? props.guild.iconURL : message.author.avatarURL);
			return embed;
		},
		menuGenerator: async (reactions, message, authorID) => {
			const reactMenu = message.createReactionCollector(
				(reaction, user) => (!authorID || user.id === authorID) && reactions.includes(reaction.emoji.name),
				{time: 120000}
			);
			reactMenu.on("collect", (reaction) => reaction.remove(authorID).catch());
			reactMenu.on("end", () => reactMenu.message.clearReactions().catch());
			for(const reaction of reactions){ 
				await message.react(reaction).catch();
			}
			return reactMenu; 
		},
		addable: (emotes, message) => {
			const emoteLimit = [50, 100, 150, 250][message.guild.premiumTier];
			const guildEmotes = [...message.guild.emojis.values()];
			if(emoteLimit === 50){ // Check for the basic boost level situation
				// Partition all emotes (guild and added) into static and animated
				const [static, animated] = emotes.concat(guildEmotes).reduce((result, emote) => {
					result[emote.animated ? 1 : 0].push(emote);
					return result;
				}, [[], []]);
				return (static.length <= 50 && animated.length <= 50);
			}
			return (guildEmotes.length+emotes.length <= emoteLimit);
		}
	};
};