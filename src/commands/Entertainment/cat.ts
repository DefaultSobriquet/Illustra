import axios from "axios";
import {MessageEmbed} from "discord.js";
import {Command} from "../../structures/Command";
import {ICommandContext} from "../../types";

const options = {
    name: "cat",
    description: "Meow! Find a cat.",
    module: "Entertainment",
    usage: "",
    examples: [""],
    aliases: ["meow"],
    userPerms: [],
    botPerms: ["SEND_MESSAGES", "EMBED_LINKS"]
}

class Cat extends Command{
	constructor(){
		super(options);
	}
	async execute(ctx: ICommandContext, client: any){
		const headers = {"x-api-key": client.config.api_tokens.thecatapi};
	
		const request = (await axios.get("https://api.thecatapi.com/v1/images/search", {headers})).data;
		
		const embed = new MessageEmbed()
			.setTitle("Meow!")
			.setImage(request[0].url)
			.setColor(ctx.guild!.me!.displayColor || 0x2f3136)
			.setTimestamp()
			.setFooter(`Requested by ${ctx.user.tag} • Powered by TheCatAPI`);
		
		ctx.channel.send(embed);
	}
}

export default Cat;