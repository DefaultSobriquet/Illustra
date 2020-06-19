import { MessageEmbed } from "discord.js";
import ms from "ms";
import { ICommandContext } from "../../types";
import { Command } from "../../structures/Command";
import IllustraClient from "../../structures/IllustraClient";

const options: Partial<Command> = {
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
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<void>{
		const embed = new MessageEmbed()
			.setTitle("Uptime")
			.setColor(ctx.guild!.me!.displayColor || 0x2f3136)
			.setTimestamp()
			.setDescription(`${Illustra.config.name} has been online for ${ms(Illustra.client.uptime ?? 0, {long: true})}.`)
			.setFooter(`PID ${process.pid} | Started on ${Illustra.client.readyAt ? Illustra.client.readyAt.toLocaleString() : "an unknown time"}`);
		
		ctx.channel.send(embed);
	}
}

export default Uptime;