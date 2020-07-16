import {MessageEmbed, Message, Role, Emoji, GuildEmoji, Client, Guild, Collection} from "discord.js";
import {uniq} from "lodash";
import {IUtilsOptions} from "../types";

class EmoteUtils{
	client: Client;
	constructor(options: IUtilsOptions){
		this.client = options.client;
	}

	/**
	 * Given an input string, checks to see if it is a Discord emoji.
	 * @param {string} input Checked for an emoji
	 * @returns {boolean} Whether or not the input string was a valid emoji
	 */
	
	validate = (input: string): boolean => /<?(a:)?(\w{2,32}):(\d{17,19})>?/.test(input);
	
	/**
	 * Resolves an input string into a GuildEmoji
	 * @param {string} input Checked for a GuildEmoji
	 * @param {boolean} guild The Guild to check within
	 * @returns {GuildEmoji|undefined} 
	 */

	resolve = (input: string, guild: Guild): (GuildEmoji|undefined) => {
		if (!input) return undefined;
		const emotes = guild!.emojis.cache;
		let emote: (GuildEmoji|undefined) = emotes.find((emote: GuildEmoji) => input.includes(`${emote.name}:${emote.id}`));
		emote = emote ?? emotes.find((emote: GuildEmoji) => emote.id === input);
		emote = emote ?? emotes.find((emote: GuildEmoji) => emote.name === input);
		emote = emote ?? emotes.find((emote: GuildEmoji) => emote.name.toLowerCase() === input.toLowerCase());
		emote = emote ?? emotes.find((emote: GuildEmoji) => emote.name.startsWith(input));
		emote = emote ?? emotes.find((emote: GuildEmoji) => emote.name.toLowerCase().startsWith(input.toLowerCase()));
		return emote;
	}

	/**
	 * Resolves an input string into matching GuildEmojis
	 * @param {string} input Checked for GuildEmojis
	 * @param {Guild} guild The Guild to check within
	 * @returns {Collection<string, GuildEmoji>} A collection of matching GuildEmojis
	 */

	search = (input: string, guild: Guild): Collection<string, GuildEmoji> => {
		const emotes = guild.emojis.cache;
		if (!input) return emotes;
		return emotes.filter((emote: GuildEmoji) => 
			input.includes(`${emote.name}:${emote.id}`) ||
			input.includes(emote.id) || emote.name.includes(input) ||
			emote.name.toLowerCase().includes(input.toLowerCase())
		);
	}

	/**
	 * Resolves an valid emoji string into an Emoji
	 * @param {string} input A valid emoji string to be converted to Emoji
	 * @returns {Emoji|undefined} An Emoji resolved from the client or a new Emoji
	 */

	props = (input: string): (Emoji|undefined) => {
		const emote = input.match(/<?(a:)?(\w{2,32}):(\d{17,19})>?/); // RegEx extractor for emote input
		if(!emote) return undefined;
		if (this.client.emojis.cache.has(emote[3])) return this.client.emojis.cache.get(emote[3]); // If emote already exists in client, return it instead
		return new Emoji(this.client, {
			animated: Boolean(emote[1]),
			name: emote[2],
			id: emote[3]
		});
	}

	/**
	 * Extracts all Emoji strings from a message (no duplicates or guild duplicates)
	 * @param {Message} message A message to extract Emoji strings from
	 * @returns {string[]} An array of Emoji strings
	 */

	extract = (message: Message, noGuild = true): string[] => {
		let emotes = message.content.match(/<(a*):(.*?)>/g);
		if (!emotes) return [];
		emotes = uniq(emotes);
		if(noGuild) emotes = emotes.filter((emote) => !message.guild!.emojis.cache.has(emote.split(":")[2].replace(">", "")));
		return emotes;
	}

	/**
	 * Generates a Discord.js embed display for an Emoji
	 * @param {Emoji} emoji An emoji to generate the embed for
	 * @param {Message} message A message to reference for Guild data and timestamps
	 * @returns {MessageEmbed} A Discord.js embed display for an Emoji
	 */

	embed = (emoji: Emoji, message: Message): MessageEmbed => {
		const embed = new MessageEmbed()
			.setTitle(`${emoji.animated ? "Animated" : "Still"} Emote - ${emoji.name}`)
			.setTimestamp(((emoji instanceof GuildEmoji) ? emoji.createdAt : message.createdAt) ?? undefined)
			.setColor(message!.guild!.me!.displayColor || 0x2f3136)
			.setDescription(`**ID**: ${emoji.id}\n**Link**: [Image URL](${emoji.url} 'Click me for the image!')\n**Roles:** ${(emoji instanceof GuildEmoji) ? emoji.roles.cache.map((r:Role) => r.toString()).join(", ") || "None.": "Unknown."}`)
			.setImage(emoji.url!)
			.setFooter((emoji instanceof GuildEmoji) ? `${emoji.guild.name} • Created` : message.author.tag, ((emoji instanceof GuildEmoji) ? emoji.guild.iconURL() : message.author.displayAvatarURL()) ?? undefined);

		return embed;
	}

	/**
	 * Gets the remaining spaces for emojis in a Guild, based on its Nitro (Premium) tier
	 * @param {Guild} guild A Guild for retrieving remaining emojis
	 * @return {{a: number, s: number, limit: number}} The static and animated spaces remaining, as well as the maximum emote limit.
	 */

	space = (guild: Guild): {a: number, s: number, limit: number} => {
		const [a, s] = guild!.emojis.cache.partition(e => e.animated);
		const limit = [50, 100, 150, 250][guild!.premiumTier];
		const space = {
			a: limit-a.size,
			s: limit-s.size,
			limit
		};
		return space;
	}
}

export default EmoteUtils;