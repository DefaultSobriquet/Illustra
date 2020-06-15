import uniq from "lodash"
import {MessageEmbed} from "discord.js";
import { Command } from "../../structures/Command";
import { ICommandContext } from "../../types";

const options = {
	name: "lock",
	description: "Lock an emote to specific roles.",
	module: "Emotes",
	usage: "[emote] [...role]",
	examples: ["rooThink Pandas"],
	aliases: ["restrict"],
	userPerms: ["MANAGE_EMOJIS", "MANAGE_ROLES"],
	botPerms: ["SEND_MESSAGES", "MANAGE_EMOJIS", "EMBED_LINKS"]
}

class Lock extends Command{
	constructor(){
		super(options);
	}
	async execute(ctx: ICommandContext, client: any){
		const {resolve} = client.utils.emotes;
	
		const emote = resolve(ctx.args[0], ctx.message);
	
		if (!emote) return ctx.channel.send("I could not find the emote provided.");
	
		let roles = ctx.args.slice(1).map((role) => client.utils.roles.resolve(role, ctx.message)).filter((role) => Boolean(role));
	
		if(!roles.length) return ctx.channel.send("I could not find any valid roles!");
	
		// This needs to be updated (we should be able to ensure guild exists when running a guildonly command)
		const integrated = ctx.message.guild!.me!.roles.cache.find((role) => role.managed);
	
		if (integrated) roles.push(integrated);
		//@ts-ignore The collection is an array?
		roles = uniq(roles);
		
	
		const embed = new MessageEmbed()
			.setTitle(`Lock Emote [${emote.name}]`)
			.setTimestamp()
			.setImage(emote.url)
			.setColor(ctx.guild!.me!.displayColor || 0x2f3136)
			.setDescription(`**Roles**: ${roles.join(", ")}`)
			.setFooter(`${ctx.user.tag}`,ctx.user.displayAvatarURL());
	
		await ctx.channel.send((!integrated) ? "Warning! I don't have an integrated role and will no longer be able to use this emote." : "", embed);
	
		emote.roles.set(roles)
			.then((emote:any) => ctx.channel.send(`\`🔒\` | [ID \`\`${emote.id}\`\`] — \`\`${emote.name}\`\``))
			.catch((err:Error) => {
				console.log(err);
				ctx.channel.send("There was a unexpected error.");
			});
	}
}

export default Lock;