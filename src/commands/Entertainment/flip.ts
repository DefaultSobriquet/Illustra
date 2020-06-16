import { Message } from "discord.js";
import { Command } from "../../structures/Command";
import { ICommandContext } from "../../types";

const options = {
    name: "flip",
    description: "Flip a coin!",
    module: "Entertainment",
    usage: "",
    examples: [""],
    aliases: ["coin", "coinflip"],
    userPerms: [],
    botPerms: ["SEND_MESSAGES"]
}

class Flip extends Command{
	constructor(){
		super(options);
	}
	async execute(ctx: ICommandContext, client: any){
		const result = ["Heads!", "Tails!"][Math.floor(Math.random() * 2)];
		ctx.channel.send(`\`${result}\``);
	}
}
