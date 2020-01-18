module.exports = (client) => {
	client.utils.emotes = {
		search: (message, input) => {
			return message.guild.emojis.filter(emote => (
				input.includes(`${emote.name}:${emote.id}`) ||
				input.includes(`${emote.id}`) || input.includes(`${emote.name}`) ||
				(input.toLowerCase()).includes(`${emote.name.toLowerCase()}`)
			));
		},
		props: (input) => {
			const emoteArray = input.replace("<", "").replace(">", "").split(":");
			return {
				"animated": emoteArray[0].includes("a"),
				"name": emoteArray[1],
				"id": emoteArray[2],
				"url": `https://cdn.discordapp.com/emojis/${emoteArray[2]}.${emoteArray[0].includes("a") ? "gif" : "png"}`,
			};
		},
		extract: (message) => {
			let emotes = message.content.match(/<(a*):(.*?)>/g);
			if(!emotes) return [];
			emotes = emotes.filter((emote, index) => (emotes.indexOf(emote) >= index)); // Filter set duplicates
			emotes = emotes.filter((emote) => !message.guild.emojis.has(emote.split(":")[2].replace(">",""))); // Filter guild duplicates
			return emotes;
		},
		obtain: (props, message) => {
			return message.guild.createEmoji(props.url,props.name,[],`Obtained by ${message.author.tag}`);
		},
		embed: (props, message) => {
			if(client.emojis.has(props.id)) props = client.emojis.get(props.id);
			return {
				embed:{
					title:`${props.animated ? "Animated" : "Still"} Emote - ${props.name}`,
					timestamp: (props.guild) ? props.createdAt : message.createdAt,
					color:message.guild.me.displayColor,
					description:`**ID**: ${props.id}\n**Link**: [Click here](${props.url})`,
					image:{
						url:props.url+"?size=2048"
					},
					footer:{
						text: (props.guild) ? `${props.guild.name} | Created` : `${message.author.tag}`,
						icon_url: (props.guild) ? props.guild.iconURL : message.author.avatarURL
					}
				}
			};
		}
	};
};