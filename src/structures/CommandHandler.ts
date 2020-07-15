import { Command } from "./Command";
import { ICommandContext } from "../types";
import { MessageEmbed, Message, DMChannel } from "discord.js";
import IllustraClient from "./IllustraClient";
import { startCase, toLower } from "lodash";
import GuildModel from "../models/Guild";
import { partition } from "lodash";
import { Flag } from "./Flag";
import ms from "ms";

class CommandHandler{

	Illustra: IllustraClient;
	
	constructor(Illustra: IllustraClient){
		this.Illustra = Illustra;
	}

	findCommand(input: string): (Command|undefined){
		const search = input.toLowerCase();
		return this.Illustra.commands.get(search) ?? this.Illustra.commands.find((c: Command) => c.aliases.includes(search));
	}

	findSubcommand(input: string, command: Command): (Command|undefined){
		const search = input.toLowerCase();
		return command.subcommands.get(search) ?? command.subcommands.find((c: Command) => c.aliases.includes(search));
	}

	sendHelp(ctx: ICommandContext, command: Command): void{
		const embed = new MessageEmbed()
			.setTitle(`Command: ${command.name}`)
			.setColor(ctx.guild?.me?.displayColor || 0x2f3136)
			.setDescription(command.description)
			.setTimestamp()
			.addField("Aliases", command.aliases.map((a) => `\`${a}\``).join(", ") || "None.", true)
			.addField("Subcommands", `${command.subcommands.map((sub) => `\`${sub.name}\``).join(", ") || "None."}`, true)
			.addField("Usage", `\`\`\`${this.Illustra.config.name} ${command.parent ? command.parent.name+" "+command.name : command.name} ${command.usage}\`\`\``)
			.addField("Flags", `\`\`\`\n${command.flags.map(f => `--${f.name.padEnd(8)} - ${f.description}`).join("\n") || "None."}\`\`\``)
			.addField("User Permissions", `${command.userPerms.map((p) => startCase(toLower(p))).join(", ") || "None."}`, true)
			.addField("Cooldown", ms(command.cooldownTime, {long: true}), true)
			.setFooter(`${startCase(command.module)} Module`);

		ctx.channel.send(embed);
		return;
	}

	async fetchPrefix(message: Message): Promise<string|undefined>{
		const prefixMention = new RegExp(`^<@!?${this.Illustra.client.user!.id}>`);
		// Mention Prefix
		let prefix = message.content.match(prefixMention)?.shift();
		// Name Prefix
		prefix = message.content.startsWith(this.Illustra.config.name) ? this.Illustra.config.name : prefix;

		if (message.guild && !prefix) {

			let guild = await GuildModel.findOne({ id: message.guild.id });
			
			if (!guild) {
				guild = new GuildModel({ id: message.guild.id });
				await guild.save();
			}
			
			prefix = guild.prefix; // Guild prefix if others don't exist
		}

		return prefix;
	}

	async handle(message: Message): Promise<void>{
		const prefix = await this.fetchPrefix(message);
		
		if(!prefix) return;

		if (message.author.bot || !message.content.startsWith(prefix)) return;

		const input = message.content.slice(prefix.length).trim().split(/ +/g);

		let cmd = this.findCommand(input.shift()!);
		if(!cmd) return;

		if(cmd.subcommands.size > 0 && input[0]){
			const subcmd = this.findSubcommand(input[0], cmd);
			if(subcmd){
				cmd = subcmd;
				input.shift();
			}
		}

		const [args, _flags] = partition(input, (i) => !(cmd!.flags.size > 0 && i.startsWith("--")));

		const flags = Flag.parseFlags(_flags, cmd);

		const ctx: ICommandContext = {
			message,
			args,
			flags,
			user: message.author,
			channel: message.channel
		};

		if(message.guild && !message.member) await message.guild.members.fetch(message.author.id);

		ctx.member = message.member ?? undefined;
		ctx.guild = message.guild ?? undefined;

		if(args[0]?.toLowerCase() === "help"){
			return this.sendHelp(ctx, cmd);
		}

		this.execute(cmd, ctx);
	}

	checkBotPerms(cmd: Command, ctx: ICommandContext): boolean{
		if(ctx.channel instanceof DMChannel) return true;
		const missingPerms = ctx.channel.permissionsFor(this.Illustra.client.user!)!.missing(cmd.botPerms);
		if(missingPerms.length){
			const embed = new MessageEmbed()
				.setTitle("Permissions Error")
				.setTimestamp()
				.setColor(ctx.guild?.me?.displayColor || 0x2f3136)
				.setDescription(`I don't have adequate permissions to run \`${cmd.name}\`.`)
				.addField("Missing Permissions", `\`${missingPerms.map((p: string) => startCase(toLower(p))).join(", ")}\``)
				.setFooter(`${ctx.guild!.name} | Missing Permissions`, ctx.guild!.iconURL() ?? undefined);

			ctx.channel.send(embed);
			return false;
		}
		return true;
	}

	async execute(cmd: Command, ctx: ICommandContext): Promise<void>{
		if(cmd.guildOnly && !ctx.guild){
			ctx.channel.send(`The command \`${cmd.name}\` must be used in a guild!`);
			return;
		}

		if(!ctx.member!.hasPermission(cmd.userPerms) && !this.Illustra.config.devs.includes(ctx.user.id))
			return;

		if(!this.checkBotPerms(cmd, ctx))
			return;

		const remaining = cmd.checkCooldown(ctx);

		if(remaining && !this.Illustra.config.devs.includes(ctx.user.id)){
			ctx.channel.send(`You need to wait ${ms(remaining)} until you can use this command again!`);
			return;
		}

		if(ctx.args.length < cmd.reqArgs){
			ctx.channel.send(`The command \`${cmd.name}\` requires at least ${cmd.reqArgs} argument${cmd.reqArgs > 1 ? "s" : ""} to run.`);
			return;
		}
		
		if(cmd.devOnly && !this.Illustra.config.devs.includes(ctx.user.id)){
			ctx.channel.send("This is a developer only command.");
			return;
		}

		const response = cmd.execute(ctx, this.Illustra);

		this.Illustra.logger.info(`${ctx.user.tag} (${ctx.user.id}) ran the command ${cmd.name}`);

		response.catch(err => {
			this.Illustra.logger.error(err);
			ctx.channel.send("There was an unexpected error!");
		});

		cmd.setCooldown(ctx);

		return;
	}

}

export default CommandHandler;