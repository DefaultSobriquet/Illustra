import {MessageEmbed} from "discord.js";
import {groupBy} from "lodash";
import { Command } from "../../../structures/Command";
import { ICommandContext } from "../../../types";
import IllustraClient from "../../../structures/IllustraClient";
import { CommandResponse } from "../../../structures/CommandResponse";

const options: Partial<Command> = {
	name: "help",
	description: "Gives helpful information about commands.",
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
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<CommandResponse>{
		if (!ctx.args[0]) {
			const commands = Illustra.commands.filter(c => !c.module!.internal).array();
			const commandList = groupBy(commands, (cmd: Command) => cmd.module!.name);
			
			const embed = new MessageEmbed()
				.setTitle("Commands")
				.setDescription("View more information with `Illustra help [command]`.")
				.setTimestamp()
				.setColor(ctx.guild?.me?.displayColor || 0x2f3136)
				.setFooter(`Requested by ${ctx.user.tag}`, ctx.user.displayAvatarURL());
	
			for(const module in commandList){
				const cmds = commandList[module];
				embed.addField(module, cmds.map((cmd:Command) => `\`${cmd.name}\``).join(" "), true);
			}
	
			embed.addField("\u200b", "\u200b", true);

			ctx.channel.send(embed);
	
		}else{

			let command = Illustra.handler.findCommand(ctx.args[0]);
			
			if(command && command.subcommands.size > 0 && ctx.args[1]){
				const subcmd = Illustra.handler.findSubcommand(ctx.args[1], command);
				if(subcmd){
					command = subcmd;
				}
			}

			if (!command){
				ctx.channel.send("That command doesn't exist."); // If commmand doesn't exist, notify.
				return new CommandResponse("CUSTOM_ERROR", "User did not provide a valid command.");
			}

			Illustra.handler.sendHelp(ctx, command);
			
		}
		return new CommandResponse();
	}
}

export default Help;