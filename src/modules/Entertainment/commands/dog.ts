import axios from "axios";
import {MessageEmbed} from "discord.js";
import { Command } from "../../../structures/Command";
import { ICommandContext } from "../../../types";
import IllustraClient from "../../../structures/IllustraClient";
import { CommandResponse } from "../../../structures/CommandResponse";

const options: Partial<Command> = {
    name: "dog",
    description: "Woof! Find a dog.",
    usage: "",
    examples: [""],
    aliases: ["woof"],
    userPerms: [],
	botPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
	guildOnly: false
};

class Dog extends Command{
	constructor(){
		super(options);
	}
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<CommandResponse>{
		const headers = {"x-api-key": Illustra.config.api_tokens.thedogapi};
	
		const request = (await axios.get("https://api.thedogapi.com/v1/images/search", {headers})).data;
		
		const embed = new MessageEmbed()
			.setTitle("Woof!")
			.setImage(request[0].url)
			.setColor(ctx.guild?.me?.displayColor || 0x2f3136)
			.setTimestamp()
			.setFooter(`Requested by ${ctx.user.tag} • Powered by TheDogAPI`);
		
		ctx.channel.send(embed);

		return new CommandResponse();
	}
}

export default Dog;