import {MessageEmbed} from "discord.js";
import { Command } from "../../structures/Command";
import { ICommandContext } from "../../types";

const options = {
	name: "info",
	description: "Displays information about the bot.",
	module: "Information",
	usage: "",
	examples: [""],
	aliases: ["about", "information"],
	userPerms: [],
	botPerms: ["SEND_MESSAGES", "EMBED_LINKS"]
}

class Info extends Command{
	constructor(){
		super(options);
	}
	async execute(ctx: ICommandContext, client: any){
		const embed = new MessageEmbed()
		.setTitle(client.config.name)
		.setTimestamp()
		.setDescription(client.config.description)
		.setColor(ctx.guild!.me!.displayColor || 0x2f3136)
		.setThumbnail(client.user.displayAvatarURL())
		.addField("Users", client.users.cache.size, true)
		.addField("Servers", client.guilds.cache.size, true)
		.addField("Emotes", client.emojis.cache.size, true)
		.addField("Developer", client.config.owner, true)
		.addField("Language", "TypeScript", true)
		.addField("Library", "Discord.js", true)
		.addField("Invite", `[Bot Invite](${client.config.invite} 'Invite me!')`, true)
		.addField("Support", `[Server Invite](${client.config.support} 'To click or not to click.')`, true)
		.setFooter(`Requested by ${ctx.user.tag}`, ctx.user.displayAvatarURL());

		ctx.channel.send(embed);
		
	}
}

export default Info;