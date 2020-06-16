import axios from "axios";
import {MessageEmbed, Message} from "discord.js";
import { Command } from "../../structures/Command";
import { ICommandContext } from "../../types";
export const run = async (client: any, message: Message, args: string[], flags: string[]) => { // eslint-disable-line no-unused-vars
	
};


const options = {
    name: "dog",
    description: "Woof! Find a dog.",
    module: "Entertainment",
    usage: "",
    examples: [""],
    aliases: ["woof"],
    userPerms: [],
    botPerms: ["SEND_MESSAGES", "EMBED_LINKS"]
}

class Dog extends Command{
	constructor(){
		super(options);
	}
	async execute(ctx: ICommandContext, client: any){
		const headers = {"x-api-key": client.config.api_tokens.thedogapi};
	
		const request = (await axios.get("https://api.thedogapi.com/v1/images/search", {headers})).data;
		
		const embed = new MessageEmbed()
			.setTitle("Woof!")
			.setImage(request[0].url)
			.setColor(ctx.guild!.me!.displayColor || 0x2f3136)
			.setTimestamp()
			.setFooter(`Requested by ${ctx.user.tag} • Powered by TheDogAPI`);
		
		ctx.channel.send(embed);
	}
}