import {MessageEmbed, Message} from "discord.js";
import {toLower, chunk, partition, lowerCase} from "lodash";
import { Command } from "../../structures/Command";
import { ICommandContext } from "../../types";

const options = {
	name: "emotes",
	description: "List all emotes in a server.",
	module: "Emotes",
	usage: "(search)",
	examples: ["cat"],
	aliases: ["emojis"],
	userPerms: [],
	botPerms: ["SEND_MESSAGES", "EMBED_LINKS"]
}

class Emotes extends Command{
	constructor(){
		super(options);
	}
	async execute(ctx: ICommandContext, client: any){
		const {search} = client.utils.emotes;
		let emotes = [...search(ctx.args.join("_"), ctx.message).values()];
		// At some point we will replace flags with some better display method.
		/*
		if(flags.includes("locked")) emotes = emotes.filter(e => e.roles.cache.size);
		if(flags.includes("animated")) emotes = emotes.filter(e => e.animated);
		if(flags.includes("static")) emotes = emotes.filter(e => !e.animated);
		*/
		if(!emotes.length) return ctx.channel.send("I could not find any emotes.");

		const [a, s] = partition(emotes, e => e.animated);

		const embed = new MessageEmbed()
			.setAuthor(`${ctx.guild!.name} ${ctx.args[0] ? `- ${ctx.args.join(" ")}` : ""}`, ctx.guild!.iconURL() ?? undefined)
			.setColor(ctx.guild!.me!.displayColor || 0x2f3136)
			.setTimestamp()
			.setFooter(`Requested by ${ctx.user.tag}`, ctx.user.displayAvatarURL());
		
		embed.setDescription(`Static - ${s.length} | Animated - ${a.length}`);

		const addEmbeds = (e:any) => chunk(e.sort((a:any, b:any) => (toLower(a.name) >= toLower(b.name)) ? 1 : -1), 20).forEach((chunk:any[]) => {
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