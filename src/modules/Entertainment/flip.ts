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
};

class Flip extends Command{
	constructor(){
		super(options);
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<void>{
		const result = ["Heads!", "Tails!"][Math.floor(Math.random() * 2)];
        ctx.channel.send(`\`${result}\``);
        return;
	}
}

export default Flip;