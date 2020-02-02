module.exports = (client) => {
	const { RichEmbed } = require("discord.js");
	client.utils.emotes = {
		resolve: (input, message) => {
			if(!input) return null; // If there is no input, exit search. 
			let emote = message.guild.emojis.find(emote => input.includes(`${emote.name}:${emote.id}`)); // Check for direct emote string
			if(emote == null) emote = message.guild.emojis.find(emote => emote.id === input); // Check for ID
			if(emote == null) emote = message.guild.emojis.find(emote => emote.name === input); // Check for full name match
			if(emote == null) emote = message.guild.emojis.find(emote => emote.name.toLowerCase() === input.toLowerCase()); // Check for lowercase name match
			if(emote == null) emote = message.guild.emojis.find(emote => emote.name.startsWith(input)); // Check for partial name match
			if(emote == null) emote = message.guild.emojis.find(emote => emote.name.toLowerCase().startsWith(input.toLowerCase())); // Check for partial lowercase name match
			return emote; // Returns the emote object (or null)
		},
		search: (input, message) => {
			return message.guild.emojis.filter(emote => // Searches for all emotes matches criteria
				!input || input.includes(`${emote.name}:${emote.id}`) 
				|| input.includes(emote.id) || emote.name.includes(input) 
				|| emote.name.toLowerCase().includes(input.toLowerCase())
			);
		},
		props: (input) => {
			const emote = input.match(/<?(a:)?(\w{2,32}):(\d{17,19})>?/); // RegEx extractor for emote input
			if(client.emojis.has(emote[3])) return client.emojis.get(emote[3]); // If emote already exists in client, return it
			return { // Return a property object
				animated: Boolean(emote[1]),
				name: emote[2], id: emote[3],
				url: `https://cdn.discordapp.com/emojis/${emote[3]}.${emote[1] ? "gif" : "png"}`
			};
		},
		extract: (message, allowGuild = false) => { 
			let emotes = message.content.match(/<(a*):(.*?)>/g); // Match all emotes
			if(!emotes) return []; // If there are no emotes, return an empty array
			emotes = [...new Set(emotes)]; // Filter emote duplicates
			if(!allowGuild) emotes = emotes.filter((emote) => !message.guild.emojis.has(emote.split(":")[2].replace(">", ""))); // If no guilds allowed, filter guild duplicates
			return emotes; // Return emotes
		},
		obtain: (props, message) => {
			return message.guild.createEmoji(props.url, props.name, [], `Obtained by ${message.author.tag}`); // Return an emote object as a promise
		},
		embed: (props, message) => {
			const embed = new RichEmbed() // Create an emote embed from properties
				.setTitle(`${props.animated ? "Animated" : "Still"} Emote - ${props.name}`)
				.setTimestamp((props.guild) ? props.createdAt : message.createdAt)
				.setColor(message.guild.me.displayColor)

				.setDescription(`**ID**: ${props.id}\n**Link**: [Image URL](${props.url})`)
				.setImage(props.url)
				.setFooter(props.guild ? `${props.guild.name} | Created` : message.author.tag, (props.guild) ? props.guild.iconURL : message.author.avatarURL);
			return embed;
		},
		menuGenerator: async (reactions, message, author) => {
			const reactMenu = message.createReactionCollector( // Generate reaction menu, limiting to a specified ID and reaction array
				(reaction, user) => (user.id === author) && reactions.includes(reaction.emoji.name),
				{time: 120000}
			);
			reactMenu.on("collect", (reaction) => reaction.remove(author).catch()); // When a reaction is added, remove it.
			reactMenu.on("end", () => reactMenu.message.clearReactions().catch()); // On collector's end, remove all reactions.
			for(const index in reactions){ // React all reactions in the array
				await message.react(reactions[index]).catch();
			}
			return reactMenu; // Return the collector as a promise
		},
		addable: (emotes, message) => {
			const emoteLimit = [50, 100, 150, 250][message.guild.premiumTier];
			const guildEmotes = [...message.guild.emojis.values()];
			if(emoteLimit === 50){
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