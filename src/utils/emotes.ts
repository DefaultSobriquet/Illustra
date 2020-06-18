import {MessageEmbed, Message, Role, Emoji, GuildEmoji, Client, Guild} from "discord.js";
import {uniq, partition} from "lodash";
import {IUtilsOptions} from "../types";

class EmoteUtils{
	client: Client;
	constructor(options: IUtilsOptions){
		this.client = options.client;
	}
	resolve = (input: string, guild: Guild) => {
		if (!input) return undefined;
		const emotes = guild!.emojis.cache;
		let emote: (GuildEmoji|undefined) = emotes.find((emote: GuildEmoji) => input.includes(`${emote.name}:${emote.id}`));
		if (emote == undefined) emote = emotes.find((emote: GuildEmoji) => emote.id === input);
		if (emote == undefined) emote = emotes.find((emote: GuildEmoji) => emote.name === input);
		if (emote == undefined) emote = emotes.find((emote: GuildEmoji) => emote.name.toLowerCase() === input.toLowerCase());
		if (emote == undefined) emote = emotes.find((emote: GuildEmoji) => emote.name.startsWith(input));
		if (emote == undefined) emote = emotes.find((emote: GuildEmoji) => emote.name.toLowerCase().startsWith(input.toLowerCase()));
		return emote;
	}
	search = (input: string, guild: Guild) => {
		const emotes = guild!.emojis.cache;
		if (!input) return emotes;
		return emotes.filter((emote) =>
			!input || input.includes(`${emote.name}:${emote.id}`) ||
			input.includes(emote.id) || emote.name.includes(input) ||
			emote.name.toLowerCase().includes(input.toLowerCase())
		);
	}
	props = (input: string) => {
		const emote = input.match(/<?(a:)?(\w{2,32}):(\d{17,19})>?/); // RegEx extractor for emote input
		if(!emote) return;
		console.log(this);
		if (this.client.emojis.cache.has(emote[3])) return this.client.emojis.cache.get(emote[3]); // If emote already exists in client, return it instead
		return new Emoji(this.client, {
			animated: Boolean(emote[1]),
			name: emote[2],
			id: emote[3]
		});
	}
	extract = (message: Message) => {
		let emotes = message.content.match(/<(a*):(.*?)>/g);
		if (!emotes) return [];
		emotes = uniq(emotes);
		emotes = emotes.filter((emote) => !message.guild!.emojis.cache.has(emote.split(":")[2].replace(">", "")));
		return emotes;
	}
	embed = (props: Emoji, message: Message) => {
		const embed = new MessageEmbed()
			.setTitle(`${props.animated ? "Animated" : "Still"} Emote - ${props.name}`)
			.setTimestamp(((props instanceof GuildEmoji) ? props.createdAt : message.createdAt) ?? undefined)
			.setColor(message!.guild!.me!.displayColor || 0x2f3136)
			.setDescription(`**ID**: ${props.id}\n**Link**: [Image URL](${props.url} 'Click me for the image!')\n**Roles:** ${(props instanceof GuildEmoji) ? props.roles.cache.map((r:Role) => r.toString()).join(", ") || "None.": "Unknown."}`)
			.setImage(props.url!)
			.setFooter((props instanceof GuildEmoji) ? `${props.guild.name} • Created` : message.author.tag, ((props instanceof GuildEmoji) ? props.guild.iconURL() : message.author.displayAvatarURL()) ?? undefined);

		return embed;
	}
	space = (guild: Guild) => {
		const [a, s] = partition(guild!.emojis.cache.array(), e => e.animated);
		const limit = [50, 100, 150, 250][guild!.premiumTier];
		const space = {
			animated: limit-a.length,
			static: limit-s.length,
			limit
		};
		return space;
	}
}

export default EmoteUtils;