import axios from "axios";
import {MessageEmbed} from "discord.js";
import {Command} from "../../../structures/Command";
import {ICommandContext} from "../../../types";
import IllustraClient from "../../../structures/IllustraClient";
import { CommandResponse } from "../../../structures/CommandResponse";

const options: Partial<Command> = {
    name: "fox",
    description: "Floof? Find a fox!",
    usage: "",
    examples: [""],
    aliases: ["meow"],
    userPerms: [],
	botPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
	guildOnly: false
};

class Fox extends Command{
	constructor(){
		super(options);
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<CommandResponse>{

		const request = (await axios.get("https://randomfox.ca/floof/")).data;
		
		const embed = new MessageEmbed()
			.setTitle("Floof!")
			.setImage(request.image)
			.setColor(ctx.guild?.me?.displayColor || 0x2f3136)
			.setTimestamp()
			.setFooter(`Requested by ${ctx.user.tag} • Powered by randomfox.ca`);
		
		ctx.channel.send(embed);

		return new CommandResponse();
	}
}

export default Fox;