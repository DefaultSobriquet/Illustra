import {MessageEmbed, Role, Emoji} from "discord.js";
import { Command } from "../../structures/Command";
import { ICommandContext } from "../../types";
import IllustraClient from "../../structures/IllustraClient";

const options: Partial<Command> = {
	name: "lock",
	description: "Lock an emote to specific roles.",
	module: "Emotes",
	usage: "[emote] [...role]",
	examples: ["rooThink Pandas"],
	aliases: ["restrict"],
	userPerms: ["MANAGE_EMOJIS", "MANAGE_ROLES"],
	botPerms: ["SEND_MESSAGES", "MANAGE_EMOJIS", "EMBED_LINKS"],
	reqArgs: 2
};

class Lock extends Command{
	constructor(){
		super(options);
	}
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<void>{
		const {resolve} = Illustra.utils.emote;
	
		const emote = resolve(ctx.args[0], ctx.guild!);
	
		if (!emote){
			ctx.channel.send("I could not find the emote provided.");
			return;
		}
	
		
		const roles: Role[] = [];

		for(const input of
			ctx.args.slice(1)){
			const role = Illustra.utils.role.resolve(input, ctx.guild!);
			if(role) roles.push(role);
		}
	
		if(!roles.length){
			ctx.channel.send("I could not find any valid roles!");
			return;
		}
	
		// This needs to be updated (we should be able to ensure guild exists when running a guildonly command)
		const integrated = ctx.guild!.me!.roles.cache.find((role) => role.managed);
	
		if (integrated) roles.push(integrated);

		const uniqRoles = [...roles];
	
		const embed = new MessageEmbed()
			.setTitle(`Lock Emote [${emote.name}]`)
			.setTimestamp()
			.setImage(emote.url)
			.setColor(ctx.guild!.me!.displayColor || 0x2f3136)
			.setDescription(`**Roles**: ${roles.join(", ")}`)
			.setFooter(`${ctx.user.tag}`,ctx.user.displayAvatarURL());
	
		await ctx.channel.send((!integrated) ? "Warning! I don't have an integrated role and will no longer be able to use this emote." : "", embed);
	
		emote.roles.set(uniqRoles)
			.then((emote: Emoji) => ctx.channel.send(`\`🔒\` | [ID \`\`${emote.id}\`\`] — \`\`${emote.name}\`\``))
			.catch((err: Error) => {
				console.error(err);
				ctx.channel.send("There was a unexpected error.");
			});
	}
}

export default Lock;