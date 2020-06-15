
import {partition} from "lodash";
import {MessageEmbed, GuildEmoji} from "discord.js";
import { Command } from "../../structures/Command";
import { ICommandContext } from "../../types";

const options = {
	name: "obtain",
	description: "Add custom emotes from a message to the server.",
	module: "Emotes",
	usage: "[message id | ...emotes]",
	examples: ["717601958126420029", ":rooThink:"],
	aliases: ["steal"],
	userPerms: ["MANAGE_EMOJIS"],
	botPerms: ["SEND_MESSAGES", "VIEW_CHANNEL", "MANAGE_EMOJIS", "READ_MESSAGE_HISTORY"]
}

class Obtain extends Command{
	constructor(){
		super(options);
	}
	async execute(ctx: ICommandContext, client: any){
		const {extract, props, space} = client.utils.emotes;

		let target;
	
		if(ctx.args.some(arg => /<?(a:)?(\w{2,32}):(\d{17,19})>?/.test(arg))) target = ctx.message;
	
		if (!target && ctx.args[0] && /^\d{17,19}$/.test(ctx.args[0])) target = await ctx.message.channel.messages.fetch(ctx.args[0], true)
			.catch(() => {
				ctx.channel.send("I could not get that message. Are you in the same channel?");
			});
	
		if (!target) return ctx.channel.send("Please provide either a message ID or emotes as arguments!");
	
		const emotes = extract(target).map((emote:any) => props(emote));
		const [a, s] = partition(emotes, "animated");
	
		if(!emotes.length) return ctx.channel.send("I couldn't find any new emotes!");
	
		const server = space(ctx.message);
	
		if(server.animated - a.length < 0 || server.static - s.length < 0){
			return ctx.channel.send(`I can't add that many emotes! Currently, there are ${server.static}/${server.limit} static and ${server.animated}/${server.limit} animated spaces for emotes.`);
		}
	
		const embed = new MessageEmbed()
			.setTitle("Obtaining Status")
			.setAuthor(ctx.guild!.name, ctx.guild!.iconURL() ?? undefined)
			.setColor(ctx.guild!.me!.displayColor || 0x2f3136)
			.setTimestamp()
			.setDescription(`**I found ${emotes.length} emote${emotes.length > 1 ? "s" : ""}!**\n${emotes.map((e:any) => `\`[ID ${e.id}] - ${e.name}\``).join("\n")}`)
			.addField("Message", `[Jump!](${target.url} 'Emotes were obtained from this message.')`, true)
			.setFooter(`Requested by ${ctx.user.tag}`, ctx.user.displayAvatarURL());
	
		const status = await ctx.channel.send(embed);
		
		// See prior notes (this needs to be replaced)
		//if(flags.includes("dry")) return;
	
		const success: GuildEmoji[] = [];
		const failed: GuildEmoji[] = [];
	
		ctx.channel.startTyping();
	
		for (const emote of emotes) {
			await ctx.guild!.emojis.create(emote.url, emote.name, {reason: `Obtained by ${ctx.user.tag}!`})
				.then((e) => success.push(e))
				.catch(() => {
					failed.push(emote);
					status.edit(`There was a unexpected error for ${emote.name}! The emote may have been a legacy emote above 256KB.`);
				});
		}
	
		embed.setDescription(success.join(" | "));
		if(failed.length) embed.addField("Failed to Add", failed.map(e => `\`${e.name}\``).join(" | "), true);
	
		status.edit(`Completed! I've added ${success.length}/${emotes.length} of your requested emotes.`, embed).finally(() => ctx.channel.stopTyping(true));
	
	}
}

export default Obtain;