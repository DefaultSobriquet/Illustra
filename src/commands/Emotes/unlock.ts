import {MessageEmbed, Message, Role, GuildEmoji} from "discord.js";
import { Command } from "../../structures/Command";
import { ICommandContext } from "../../types";

const options = {
    name: "unlock",
    description: "Unlock an emote from all roles.",
    module: "Emotes",
    usage: "[emote]",
    examples: ["rooThink"],
    aliases: ["unrestrict"],
    userPerms: ["MANAGE_EMOJIS", "MANAGE_ROLES"],
    botPerms: ["SEND_MESSAGES", "MANAGE_EMOJIS", "EMBED_LINKS"]
}

class Unlock extends Command{
	constructor(){
		super(options);
	}
	async execute(ctx: ICommandContext, client: any){
		const {resolve} = client.utils.emotes;
		const emote = resolve(ctx.args[0], ctx.message);
		if (!emote) return ctx.channel.send("I could not find the emote provided.");
		
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
				console.log(err);
				ctx.channel.send("There was a unexpected error.");
			});
	}
}

export default Unlock;