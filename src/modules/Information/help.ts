import {MessageEmbed} from "discord.js";
import {groupBy, toLower, startCase} from "lodash";
import { Command } from "../../structures/Command";
import { ICommandContext } from "../../types";
import IllustraClient from "../../structures/IllustraClient";

const options: Partial<Command> = {
	name: "help",
	description: "Gives helpful information about commands.",
	module: "Information",
	usage: "(command)",
	examples: ["emote"],
	aliases: [],
	userPerms: [],
	botPerms: ["SEND_MESSAGES"]
};

class Help extends Command{
	constructor(){
		super(options);
	}
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<void>{
		if (!ctx.args[0]) { // Check if there is no argument.
			const commands = groupBy(Illustra.commands.array(), (cmd: Command) => cmd.module);
			
			const embed = new MessageEmbed()
				.setTitle("Commands")
				.setTimestamp()
				.setColor(ctx.guild!.me!.displayColor || 0x2f3136)
				.setFooter(`Requested by ${ctx.user.tag}`, ctx.user.displayAvatarURL());
	
			for(const module in commands){
				const cmds = commands[module];
				embed.addField(module, cmds.map((cmd:Command) => `\`${cmd.name}\` - ${cmd.description}`).join("\n"));
			}
	
			ctx.channel.send(embed);
	
		}else{

			const search = ctx.args[0].toLowerCase(); // Take the first argument as a search term.
			const command: (Command|undefined) = Illustra.commands.get(search) ?? Illustra.commands.find((c:Command) => c.aliases.includes(search)); // Attempt to retrieve search
			
			if (!command){
				ctx.channel.send("I've never heard of that command before."); // If commmand doesn't exist, notify.
				return;
			}

			const embed = new MessageEmbed()
				.setTitle(`Command: ${command.name}`)
				.setColor(ctx.guild!.me!.displayColor || 0x2f3136)
				.setDescription(command.description)
				.addField("Category", command.module, true)
				.addField("Aliases", command.aliases.map((a: string) => `\`${a}\``).join(", ") || "None.", true)
				.addField("Usage", `\`\`\`${Illustra.config.name} ${command.name} ${command.usage}\`\`\``)
				.addField("Example", `\`\`\`${command.examples.map((example) => `${Illustra.config.name} ${command.name} ${example}`).join("\n")}\`\`\``)
				.addField("Permissions", `${command.userPerms.map((p) => startCase(toLower(p))).join(", ") || "None."}`)
				.setFooter(`Requested by ${ctx.user.tag}`, ctx.user.displayAvatarURL());
			
			ctx.channel.send(embed);
		}
	}
}

export default Help;