import { Command } from "../../../structures/Command";
import { ICommandContext } from "../../../types";
import GuildModel from "../../../models/Guild.js";
import IllustraClient from "../../../structures/IllustraClient";
import { CommandResponse } from "../../../structures/CommandResponse";

const options: Partial<Command> = {
    name: "prefix",
    description: "Sets or views the guild prefix.",
    usage: "(prefix)",
    examples: ["", "_"],
    aliases: [],
    userPerms: ["MANAGE_GUILD"],
    botPerms: ["SEND_MESSAGES"]
};

class Prefix extends Command{
	constructor(){
		super(options);
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<CommandResponse>{
		let guild = await GuildModel.findOne({id: ctx.guild!.id});
		
		if(!guild){
			const mongoGuild = new GuildModel({id: ctx.guild!.id}); // Add the new guild model
			guild = await mongoGuild.save();
		}
		
		if(!ctx.args[0]){
			ctx.channel.send(`Your guild's prefix is \`${guild.prefix}\`.`);
			return new CommandResponse();
		}

		if(ctx.args[0].length > 5){
			ctx.channel.send("Your prefix must not be more than five characters.");
			return new CommandResponse();
		}
		
		guild = await GuildModel.findOneAndUpdate({id: ctx.guild!.id}, {$set: {prefix: ctx.args[0]}}, {new: true});
		
		ctx.channel.send(`\`${ctx.args[0]}\` is now your prefix.`);

		return new CommandResponse();
	}
}

export default Prefix;