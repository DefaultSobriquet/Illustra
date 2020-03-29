module.exports = (client) => {
	const {MessageEmbed} = require("discord.js");
	client.utils.emotes = {
		resolve: (input, message) => {
			if (!input) return null;
			const emotes = message.guild.emojis.cache;
			let emote = emotes.find((emote) => input.includes(`${emote.name}:${emote.id}`));
			if (emote == null) emote = emotes.find((emote) => emote.id === input);
			if (emote == null) emote = emotes.find((emote) => emote.name === input);
			if (emote == null) emote = emotes.find((emote) => emote.name.toLowerCase() === input.toLowerCase());
			if (emote == null) emote = emotes.find((emote) => emote.name.startsWith(input));
			if (emote == null) emote = emotes.find((emote) => emote.name.toLowerCase().startsWith(input.toLowerCase()));
			return emote;
		},
		search: (input, message) => {
			const emotes = message.guild.emojis.cache;
			if (!input) return emotes;
			return emotes.cache.filter((emote) =>
				!input || input.includes(`${emote.name}:${emote.id}`) ||
				input.includes(emote.id) || emote.name.includes(input) ||
				emote.name.toLowerCase().includes(input.toLowerCase()),
			);
		},
		props: (input) => {
			const emote = input.match(/<?(a:)?(\w{2,32}):(\d{17,19})>?/); // RegEx extractor for emote input
			if (client.emojis.cache.has(emote[3])) return client.emojis.cache.get(emote[3]); // If emote already exists in client, return it instead
			return {
				animated: Boolean(emote[1]),
				name: emote[2],
				id: emote[3],
				url: `https://cdn.discordapp.com/emojis/${emote[3]}.${emote[1] ? "gif" : "png"}`,
				identifier: emote[1] ? `a:${emote[2]}:${emote[3]}` : `${emote[2]}:${emote[3]}`,
			};
		},
		extract: (message, allowGuild = false) => {
			let emotes = message.content.match(/<(a*):(.*?)>/g);
			if (!emotes) return [];
			emotes = [...new Set(emotes)];
			if (!allowGuild) emotes = emotes.filter((emote) => !message.guild.emojis.cache.has(emote.split(":")[2].replace(">", ""))); // If no guilds allowed, filter guild duplicates
			return emotes;
		},
		obtain: (props, message) => {
			return message.guild.emojis.create(props.url, props.name, [], `Obtained by ${message.author.tag}`);
		},
		embed: (props, message) => {
			const embed = new MessageEmbed()
				.setTitle(`${props.animated ? "Animated" : "Still"} Emote - ${props.name}`)
				.setTimestamp((props.guild) ? props.createdAt : message.createdAt)
				.setColor(message.guild.me.displayColor)
				.setDescription(`**ID**: ${props.id}\n**Link**: [Image URL](${props.url})`)
				.setImage(props.url)
				.setFooter(props.guild ? `${props.guild.name} | Created` : message.author.tag, (props.guild) ? props.guild.iconURL : message.author.avatarURL);
			return embed;
		},
		/**
			* @function menuGenerator Creates a reaction menu
			* @param options.preset Selects a preset list of reactions
			* @param options.id Limits the collector to a specific User ID.
			* @param options.reactions An array of reactions to use.
			* @returns {Promise<ReactionCollector>} A message reaction collector.

		*/
		menuGenerator: async (options, message) => {
			const reactionSet = {
				confirm: ["success:691141985418870866", "failure:691142169565724672"],
				pages: ["⏮️", "⬅️", "➡️", "⏭️"],
			};

			const reactions = options.reactions ? options.reactions : [];
			if (options.preset) reactions.unshift(...reactionSet[options.preset]);

			const reactMenu = await message.createReactionCollector(
				(reaction, user) => (user.id === options.id) && reactions.includes(reaction.emoji.identifier),
				{time: 120000, idle: 30000},
			);

			reactMenu.on("collect", (reaction, user) => {
				reaction.users.remove(user).catch((err) => console.log(err));
				console.log("hello there!");
			});

			reactMenu.on("end", (collector) =>
				collector.message.reactions.removeAll(),
			);

			for (const reaction of reactions) {
				await message.react(reaction).catch();
			}

			return reactMenu;
		},
		addable: (emotes, message) => {
			const emoteLimit = [50, 100, 150, 250][message.guild.premiumTier];
			const guildEmotes = [...message.guild.emojis.values()];
			if (emoteLimit === 50) { // Check for the basic boost level situation
				// Partition all emotes (guild and added) into static and animated
				const [static, animated] = emotes.concat(guildEmotes).reduce((result, emote) => {
					result[emote.animated ? 1 : 0].push(emote);
					return result;
				}, [[], []]);
				return (static.length <= 50 && animated.length <= 50);
			}
			return (guildEmotes.length+emotes.length <= emoteLimit);
		},
	};
};
