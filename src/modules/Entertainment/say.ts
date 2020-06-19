import { ICommandContext } from "../../types";
import { Command } from "../../structures/Command";
import IllustraClient from "../../structures/IllustraClient";

const options: Partial<Command> = {
    name: "say",
    description: "Make the bot say something.",
    module: "Entertainment",
    usage: "[...message]",
    examples: ["A towel has immense psychological value."],
    aliases: ["echo", "speak"],
    userPerms: ["MANAGE_MESSAGES"],
    botPerms: ["SEND_MESSAGES", "MANAGE_MESSAGES"],
    reqArgs: 1
};

class Say extends Command{
	constructor(){
		super(options);
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<void>{
		ctx.message.delete().catch();
        ctx.channel.send(ctx.args.join(" ")).catch();
        return;
	}
}

export default Say;