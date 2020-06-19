import { Util } from "discord.js";
import { Command } from "../../structures/Command";
import { ICommandContext } from "../../types";
import IllustraClient from "../../structures/IllustraClient";

const options: Partial<Command> = {
	name: "eval",
	description: "Evaluates arbitrary javascript.",
	module: "System",
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
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<void>{

		const code = ctx.args.join(" "); // Generate string input.

		if (code.includes("client.token")){
			ctx.channel.send("No thanks."); // Prevent attempts to get the token.
			return;
		}
		
		try {
			const evaled = await (code.includes("await") ? eval("async function foo(){" + code + "}; foo()") : eval(code)); // Evaluate the code
			const clean = Illustra.clean(evaled); // Clean the code
			const messages = Util.splitMessage(clean, {maxLength: 1990});
			if (typeof (messages) === "string"){
				ctx.channel.send(`\`\`\`js\n${messages}\`\`\``);
				return;
			}
			messages.forEach((value) => ctx.channel.send(`\`\`\`js\n${value || "No output."}\`\`\``));
		} catch (err) {
			ctx.channel.send(`\`ERROR\` \`\`\`xl\n${Illustra.clean(err)}\n\`\`\``);
		}
	}
}

export default Eval;