import { ICommandContext } from "../../types";
import { Command } from "../../structures/Command";

const options = {
    name: "say",
    description: "Make the bot say something.",
    module: "Entertainment",
    usage: "[...message]",
    examples: ["A towel has immense psychological value."],
    aliases: ["echo", "speak"],
    userPerms: ["MANAGE_MESSAGES"],
    botPerms: ["SEND_MESSAGES", "MANAGE_MESSAGES"]
}

class Say extends Command{
	constructor(){
		super(options);
	}
	async execute(ctx: ICommandContext, client: any){
		ctx.message.delete().catch();
		ctx.channel.send(ctx.args.join(" ")).catch();
	}
}