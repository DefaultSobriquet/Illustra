import {MessageEmbed, Role } from "discord.js";
import { Command } from "../../../structures/Command";
import { ICommandContext } from "../../../types";
import IllustraClient from "../../../structures/IllustraClient";
import { CommandResponse } from "../../../structures/CommandResponse";

const options: Partial<Command> = {
    name: "unlock",
    description: "Unlock an emote from all roles.",
    usage: "[emote]",
    examples: ["rooThink"],
    aliases: ["unrestrict"],
    userPerms: ["MANAGE_EMOJIS", "MANAGE_ROLES"],
	botPerms: ["SEND_MESSAGES", "MANAGE_EMOJIS", "EMBED_LINKS"],
	reqArgs: 1
};

class Unlock extends Command{
	constructor(){
		super(options);
	}
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<CommandResponse>{
		const {resolve} = Illustra.utils.emote;
		const emote = resolve(ctx.args[0], ctx.guild!);
		
		if (!emote){
			ctx.channel.send("That's not a valid emote!");
			return new CommandResponse("CUSTOM_ERROR", "User did not enter a valid emote.");
		}

		if(!emote.roles.cache.size){
			ctx.channel.send("There are no roles to unlock.");
			return new CommandResponse("CUSTOM_ERROR", "No roles to remove from emote.");
		}

		const embed = new MessageEmbed()
			.setTitle(`Unlock Emote [${emote.name}]`)
			.setTimestamp()
			.setDescription(`**Current Roles**: ${emote.roles.cache.map((role: Role) => `${role}`).join(", ")}`)
			.setImage(emote.url)
			.setColor(ctx.guild?.me?.displayColor || 0x2f3136)
			.setFooter(`Requested by ${ctx.user.tag}`, ctx.user.displayAvatarURL());

		await ctx.channel.send(embed);

		emote.roles.set([])
			.then((emote) => ctx.channel.send(`\`🔓\` | [ID \`\`${emote.id}\`\`] — \`\`${emote.name}\`\``))
			.catch((err) => {
				Illustra.logger.error(err);
				ctx.channel.send("There was a unexpected error.");
			});

		return new CommandResponse();
	}
}

export default Unlock;