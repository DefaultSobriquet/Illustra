import { Util } from "discord.js";
import { Command } from "../../../structures/Command";
import { ICommandContext } from "../../../types";
import IllustraClient from "../../../structures/IllustraClient";
import { CommandResponse } from "../../../structures/CommandResponse";

const options: Partial<Command> = {
	name: "eval",
	description: "Evaluates arbitrary javascript.",
	usage: "[...code]",
	examples: ["message.reply(\"No\")"],
	aliases: ["e", "evaluate"],
	userPerms: [],
	botPerms: ["SEND_MESSAGES"],
	devOnly: true,
	reqArgs: 1
};

class Eval extends Command{
	constructor(){
		super(options);
	}
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<CommandResponse>{

		const code = ctx.args.join(" "); // Generate string input.

		if (code.includes("client.token")){
			ctx.channel.send("But we just met!"); // Prevent attempts to get the token.
			return new CommandResponse("CUSTOM_ERROR", "Prevented attempt to retrieve token.");
		}
		
		try {
			const evaled = await (code.includes("await") ? eval("async function foo(){" + code + "}; foo()") : eval(code)); // Evaluate the code
			const clean = Illustra.utils.clean(evaled); // Clean the code
			const messages = Util.splitMessage(clean, {maxLength: 1990});
			if (typeof (messages) === "string"){
				ctx.channel.send(`\`\`\`js\n${messages}\`\`\``);
				return new CommandResponse();
			}
			messages.forEach((value) => ctx.channel.send(`\`\`\`js\n${value ?? "No output."}\`\`\``));
		} catch (err) {
			ctx.channel.send(`\`ERROR\` \`\`\`xl\n${Illustra.utils.clean(err)}\n\`\`\``);
		}

		return new CommandResponse();
	}
}

export default Eval;