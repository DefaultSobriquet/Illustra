import { Command } from "../../../structures/Command";
import { ICommandContext } from "../../../types";
import IllustraClient from "../../../structures/IllustraClient";
import { CommandResponse } from "../../../structures/CommandResponse";
import { MessageEmbed } from "discord.js";

class Profile extends Command{
	constructor(options?: Partial<Command>){
		super(options ?? {
			name: "profile",
			description: "Views the specified user's profile.",
			usage: "[user]",
			examples: ["", "Sobriquet"],
			aliases: [],
			userPerms: [],
			botPerms: ["SEND_MESSAGES"]
		});
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<CommandResponse>{

		const target = Illustra.utils.user.resolve(ctx.args[0], ctx.message);

		if(!target){
			ctx.channel.send("I couldn't find that user!");
			return new CommandResponse("CUSTOM_ERROR", "User couldn't be found.");
		}

		const {count, lastRecieved} = await Illustra.managers.user.getRep(target.id);
		const {nickname, bio, colour} = await Illustra.managers.user.getProfile(target.id);
	
		const embed = new MessageEmbed()
			.setTitle(`${nickname ?? target.user.username}'s Profile`)
			.setDescription(`**About:** ${bio}`)
			.setColor(colour ?? (target.displayColor || 0x2f3136))
			.addField("Reputation", `${count} Points`);

		if(lastRecieved?.emote && lastRecieved?.timestamp){
			const emoteDoc = (await Illustra.managers.emote.model.findById(lastRecieved.emote))!;
			embed.setTimestamp(lastRecieved.timestamp)
				.setFooter("Reputation Emote", `https://cdn.discordapp.com/emojis/${emoteDoc.id}.${emoteDoc.animated ? "gif" : "png"}?v=1`);
		}

		ctx.channel.send(embed);

		return new CommandResponse();
	}
}

class Set extends Profile{
	constructor(){
		super({
			name: "set",
			description: "Sets your profile bio, with a max of 200 characters.",
			usage: "[bio]",
			examples: ["Hello. My name is Inigo Montoya."],
			aliases: [],
			userPerms: [],
			botPerms: ["SEND_MESSAGES"]
		});
	}
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<CommandResponse>{
		
		const bio = ctx.args.join(" ") || "Be different and you'll always stand out.";
		await Illustra.managers.user.setBio(ctx.user.id, bio);
		
		ctx.channel.send("Your bio has been updated!");
		
		return new CommandResponse();
	}
}

export const subcommands = [
	new Set()
];
export default Profile;