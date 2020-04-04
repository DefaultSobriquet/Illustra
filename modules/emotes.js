module.exports = (client) => {
	const {MessageEmbed} = require("discord.js");
	const _ = require("lodash/array");

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
			return emotes.filter((emote) =>
				!input || input.includes(`${emote.name}:${emote.id}`) ||
				input.includes(emote.id) || emote.name.includes(input) ||
				emote.name.toLowerCase().includes(input.toLowerCase())
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
				identifier: emote[1] ? `a:${emote[2]}:${emote[3]}` : `${emote[2]}:${emote[3]}`
			};
		},
		extract: (message) => {
			let emotes = message.content.match(/<(a*):(.*?)>/g);
			if (!emotes) return [];
			emotes = _.uniq(emotes);
			emotes = emotes.filter((emote) => !message.guild.emojis.cache.has(emote.split(":")[2].replace(">", "")));
			return emotes;
		},
		embed: (props, message) => {

			const embed = new MessageEmbed()
				.setTitle(`${props.animated ? "Animated" : "Still"} Emote - ${props.name}`)
				.setTimestamp((props.guild) ? props.createdAt : message.createdAt)
				.setColor(message.guild.me.displayColor)
				.setDescription(`**ID**: ${props.id}\n**Link**: [Image URL](${props.url})`)
				.setImage(props.url)
				.setFooter(props.guild ? `${props.guild.name} • Created` : message.author.tag, (props.guild) ? props.guild.iconURL() : message.author.avatarURL());

			return embed;
		}
	};
};
