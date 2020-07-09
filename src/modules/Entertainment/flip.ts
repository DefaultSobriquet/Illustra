import { Command } from "../../structures/Command";
import { ICommandContext } from "../../types";
import IllustraClient from "../../structures/IllustraClient";
import { CommandResponse } from "../../structures/CommandResponse";

const options: Partial<Command> = {
    name: "flip",
    description: "Flip a coin!",
    module: "Entertainment",
    usage: "",
    examples: [""],
    aliases: ["coin", "coinflip"],
    userPerms: [],
    botPerms: ["SEND_MESSAGES"],
    guildOnly: false
};

class Flip extends Command{
	constructor(){
		super(options);
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<CommandResponse>{
		const result = ["Heads!", "Tails!"][Math.floor(Math.random() * 2)];
        ctx.channel.send(`\`${result}\``);
        return new CommandResponse();
	}
}

export default Flip;