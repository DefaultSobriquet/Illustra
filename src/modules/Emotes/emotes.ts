import { MessageEmbed, GuildEmoji, Collection } from "discord.js";
import { chunk } from "lodash";
import { Command } from "../../structures/Command";
import { ICommandContext } from "../../types";
import IllustraClient from "../../structures/IllustraClient";
import { CommandResponse } from "../../structures/CommandResponse";
import { Flag } from "../../structures/Flag";

const options: Partial<Command> = {
	name: "emotes",
	description: "List all emotes in a server.",
	module: "Emotes",
	usage: "(search)",
	examples: ["cat"],
	aliases: ["emojis"],
	userPerms: [],
	botPerms: ["SEND_MESSAGES", "EMBED_LINKS"]
};

class Emotes extends Command{
	constructor(){
		super(options);
	}

	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<CommandResponse>{
		const {search} = Illustra.utils.emote;
		let emotes = search(ctx.args.join("_"), ctx.guild!);

		if("animated" in ctx.flags) emotes = emotes.filter(e => e.animated);
		if("static" in ctx.flags) emotes = emotes.filter(e => !e.animated);
		if("locked" in ctx.flags) emotes = emotes.filter(e => e.roles.cache.size > 0);

		if(!emotes.size){
			ctx.channel.send("I couldn't find any emotes!");
			return new CommandResponse("CUSTOM_ERROR", "The bot couldn't find any emotes.");
		}

		const [a, s] = emotes.partition(e => e.animated);

		const embed = new MessageEmbed()
			.setAuthor(`${ctx.guild!.name} ${ctx.args[0] ? `- ${ctx.args.join(" ")}` : ""}`, ctx.guild?.iconURL() ?? undefined)
			.setColor(ctx.guild?.me?.displayColor || 0x2f3136)
			.setTimestamp()
			.setFooter(`Requested by ${ctx.user.tag}`, ctx.user.displayAvatarURL());
			
		embed.setDescription(`Static - ${s.size} | Animated - ${a.size}`);

		const divider = (emoteList: Collection<string, GuildEmoji>) => {
			const emoteArray = emoteList.array().sort();
			chunk(emoteArray, 20).forEach((emoteChunk: GuildEmoji[]) => {
				const emoteField = emoteChunk.map(emote => `${emote.roles.cache.size ? `\`${emote.name}\`` : emote}`).join(" ");
				const fieldTitle = `${emoteChunk[0].name} to ${emoteChunk[emoteChunk.length-1].name}`;
				embed.addField(fieldTitle, emoteField, false);
			})
		};
		
		divider(s);
		divider(a);

		ctx.channel.send(embed);

		return new CommandResponse();
	}
	
}

export const flags = [
	new Flag({
		name: "animated",
		description: "Filters for animated emotes.",
		hasValue: false
	}),
	new Flag({
		name: "static",
		description: "Filters for static emotes.",
		hasValue: false
	}),
	new Flag({
		name: "locked", 
		description: "Filters for locked emotes.",
		hasValue: false
	})
]

export default Emotes;