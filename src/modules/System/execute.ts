import { Util } from "discord.js";
import { Command } from "../../structures/Command";
import { ICommandContext } from "../../types";
import { exec } from "child_process";
import IllustraClient from "../../structures/IllustraClient";
import { CommandResponse } from "../../structures/CommandResponse";

const options: Partial<Command> = {
	name: "execute",
	description: "Executes a shell command.",
	module: "System",
	usage: "[...command]",
	examples: ["git commit -m \"Fix: [Un]break things.\""],
	aliases: ["exec", "exe"],
	userPerms: [],
	botPerms: ["SEND_MESSAGES"],
	devOnly: true,
	reqArgs: 1
};

class Execute extends Command{
	constructor(){
		super(options);
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<CommandResponse>{
		
		try {
			let output = "No output.";
			
			exec(ctx.args.join(" "), (err, stdout, stderr) => {
				if (err) output = err.stack ?? "Error did not have a stack.";
				if (stdout && stdout.length !== 0) output = stdout;
				if (stderr && stderr.length !== 0) output = stderr;
				const messages = Util.splitMessage(output);
				if (typeof (messages) === "string") return ctx.channel.send(`\`\`\`bash\n${messages}\`\`\``);
				messages.forEach((value) => ctx.channel.send(`\`\`\`bash\n${value}\`\`\``));
			});
		} catch (err) {
			ctx.channel.send(`\`\`\`bash\n${err}\`\`\``);
		}

		return new CommandResponse();
	}
}

export default Execute;