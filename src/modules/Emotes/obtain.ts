
import {partition} from "lodash";
import {MessageEmbed, Emoji} from "discord.js";
import { Command } from "../../structures/Command";
import { ICommandContext } from "../../types";
import IllustraClient from "../../structures/IllustraClient";
import { CommandResponse } from "../../structures/CommandResponse";
import { Flag } from "../../structures/Flag";

const options: Partial<Command> = {
	name: "obtain",
	description: "Add custom emotes from a message to the server.",
	module: "Emotes",
	usage: "[message id | ...emotes]",
	examples: ["717601958126420029", ":rooThink:"],
	aliases: ["steal"],
	userPerms: ["MANAGE_EMOJIS"],
	botPerms: ["SEND_MESSAGES", "VIEW_CHANNEL", "MANAGE_EMOJIS", "READ_MESSAGE_HISTORY"],
	reqArgs: 1
};

class Obtain extends Command{
	constructor(){
		super(options);
	}
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<CommandResponse>{
		const {extract, props, space, validate} = Illustra.utils.emote;

		let target = await Illustra.utils.parseMessage(ctx.args[0]);

		if(!target && ctx.args.some(arg => validate(arg))) target = ctx.message;

		if(!target && /^\d{17,19}$/.test(ctx.args[0])){
			const message = await ctx.channel.messages.fetch(ctx.args[0])
				.catch(() => {
					ctx.channel.send("I couldn't get that message. Are you in the same channel?");
				});
			if(message) target = message;
		}
	
		if (!target){
			ctx.channel.send("Make sure you're giving me emotes or a message ID.");
			return new CommandResponse("CUSTOM_ERROR", "Bot was unable to resolve emotes/message ID.");
		}
	
		const emotes = extract(target).map((emote) => props(emote)!);
		const [a, s] = partition(emotes, "animated");
	
		if(!emotes.length){
			ctx.channel.send("I couldn't find any new emotes.");
			return new CommandResponse("CUSTOM_ERROR", "Bot was unable to find any new emotes.");
		}

		const server = space(ctx.guild!);
	
		if(server.a - a.length < 0 || server.s - s.length < 0){
			ctx.channel.send(`I can't add that many emotes! Currently, there are ${server.s}/${server.limit} static and ${server.a}/${server.limit} animated spaces for emotes.`);
			return new CommandResponse("CUSTOM_ERROR", "Too many emotes to add to server.");
		}
	
		const embed = new MessageEmbed()
			.setTitle("Obtaining Status")
			.setAuthor(ctx.guild!.name, ctx.guild!.iconURL() ?? undefined)
			.setColor(ctx.guild?.me?.displayColor || 0x2f3136)
			.setTimestamp()
			.setDescription(`**I found ${emotes.length} emote${emotes.length > 1 ? "s" : ""}!**\n${emotes.map((e:Emoji) => `\`[ID ${e.id}] - ${e.name}\``).join("\n")}`)
			.addField("Message", `[Jump!](${target.url} 'Emotes were obtained from this message.')`, true)
			.setFooter(`Requested by ${ctx.user.tag}`, ctx.user.displayAvatarURL());
	
		const status = await ctx.channel.send(embed);
		
		if("dry" in ctx.flags) return new CommandResponse();
	
		const success: Emoji[] = [];
		const failed: Emoji[] = [];
	
		ctx.channel.startTyping();
	
		for (const emote of emotes) {
			if(emote){
				await ctx.guild!.emojis.create(emote.url!, emote.name, {reason: `Obtained by ${ctx.user.tag}`})
					.then((e) => success.push(e))
					.catch(() => {
						failed.push(emote);
						status.edit(`There was a unexpected error for ${emote.name}! The emote may have been a legacy emote above 256KB.`);
					});
			}
		}
	
		embed.setDescription(success.join(" | "));
		if(failed.length) embed.addField("Failed to Add", failed.map(e => `\`${e.name}\``).join(" | "), true);
	
		status.edit(`Completed! I've added ${success.length}/${emotes.length} of your requested emotes.`, embed).finally(() => ctx.channel.stopTyping(true));

		return new CommandResponse();
	}
}

export const flags = [
	new Flag({
		name: "dry",
		description: "Checks for emotes without adding them.",
		hasValue: false
	})
];

export default Obtain;