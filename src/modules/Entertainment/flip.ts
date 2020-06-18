import { Message } from "discord.js";
import { Command } from "../../structures/Command";
import { ICommandContext } from "../../types";
import IllustraClient from "../../structures/IllustraClient";

const options: Partial<Command> = {
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
	async execute(ctx: ICommandContext, Illustra: IllustraClient){
		const result = ["Heads!", "Tails!"][Math.floor(Math.random() * 2)];
		ctx.channel.send(`\`${result}\``);
	}
}

export default Flip;