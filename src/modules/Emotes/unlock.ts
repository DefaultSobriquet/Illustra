import {MessageEmbed, Role, GuildEmoji} from "discord.js";
import { Command } from "../../structures/Command";
import { ICommandContext } from "../../types";
import IllustraClient from "../../structures/IllustraClient";

const options: Partial<Command> = {
    name: "unlock",
    description: "Unlock an emote from all roles.",
    module: "Emotes",
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
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<void>{
		const {resolve} = Illustra.utils.emote;
		const emote = resolve(ctx.args[0], ctx.guild!);
		
		if (!emote){
			ctx.channel.send("I looked, but I couldn't find the emote provided.");
			return;
		}

		const embed = new MessageEmbed()
			.setTitle(`Unlock Emote [${emote.name}]`)
			.setTimestamp()
			.setDescription(`**Current Roles**: ${emote.roles.cache.map((role: Role) => `${role}`).join(", ")}`)
			.setImage(emote.url)
			.setColor(ctx.guild!.me!.displayColor || 0x2f3136)
			.setFooter(`${ctx.user.tag}`, ctx.user.displayAvatarURL());

		await ctx.channel.send(embed);

		emote.roles.set([])
			.then((emote: GuildEmoji) => ctx.channel.send(`\`🔓\` | [ID \`\`${emote.id}\`\`] — \`\`${emote.name}\`\``))
			.catch((err: Error) => {
				Illustra.logger.error(err);
				ctx.channel.send("There was a unexpected error (as opposed to the expected ones).");
			});
	}
}

export default Unlock;