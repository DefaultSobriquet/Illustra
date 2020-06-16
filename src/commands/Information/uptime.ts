import { MessageEmbed } from "discord.js";
import ms from "ms";
import { ICommandContext } from "../../types";
import { Command } from "../../structures/Command";

const options = {
	name: "uptime",
	description: "Displays how long the bot has been up.",
	module: "Information",
	usage: "",
	examples: [""],
	aliases: ["up"],
	userPerms: [],
	botPerms: ["SEND_MESSAGES", "EMBED_LINKS"]
};

class Uptime extends Command{
	constructor(){
		super(options);
	}
	async execute(ctx: ICommandContext, client: any){
		const embed = new MessageEmbed()
			.setTitle("Uptime")
			.setColor(ctx.guild!.me!.displayColor || 0x2f3136)
			.setTimestamp()
			.setDescription(`${client.config.name} has been online for ${ms(client.uptime, {long: true})}.`)
			.setFooter(`PID ${process.pid} | Started on ${client.readyAt.toLocaleString()}`);
		
		ctx.channel.send(embed);
	}
}

export default Uptime;