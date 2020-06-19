import {MessageEmbed, GuildEmoji} from "discord.js";
import {toLower, chunk, partition, lowerCase} from "lodash";
import { Command } from "../../structures/Command";
import { ICommandContext } from "../../types";
import IllustraClient from "../../structures/IllustraClient";

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
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<void>{
		const {search} = Illustra.utils.emote;
		const emotes = [...search(ctx.args.join("_"), ctx.guild!).values()];
		// At some point we will replace flags with some better display method.
		/*
		if(flags.includes("locked")) emotes = emotes.filter(e => e.roles.cache.size);
		if(flags.includes("animated")) emotes = emotes.filter(e => e.animated);
		if(flags.includes("static")) emotes = emotes.filter(e => !e.animated);
		*/
		if(!emotes.length){
			ctx.channel.send("I tried, but I couldn't find any emotes.");
			return;
		}

		const [a, s] = partition(emotes, e => e.animated);

		const embed = new MessageEmbed()
			.setAuthor(`${ctx.guild!.name} ${ctx.args[0] ? `- ${ctx.args.join(" ")}` : ""}`, ctx.guild!.iconURL() ?? undefined)
			.setColor(ctx.guild!.me!.displayColor || 0x2f3136)
			.setTimestamp()
			.setFooter(`Requested by ${ctx.user.tag}`, ctx.user.displayAvatarURL());
			
		embed.setDescription(`Static - ${s.length} | Animated - ${a.length}`);

		const addEmbeds = (e:GuildEmoji[]) => chunk(e.sort((a:GuildEmoji, b:GuildEmoji) => (toLower(a.name) >= toLower(b.name)) ? 1 : -1), 20).forEach((chunk:GuildEmoji[]) => {
			const first = chunk[0].name.slice(0, 2);
			const last = chunk[chunk.length-1].name.slice(0, 2);
			// See above.
			embed.addField(lowerCase(`${first} to ${last}`), chunk.map(e => e.roles.cache.size /*|| flags.includes("names")*/ ? `\`${e.name}\`` : `${e}`).join(" "));
		});

		addEmbeds(s);
		addEmbeds(a);

		ctx.channel.send(embed);
	}
}

export default Emotes;