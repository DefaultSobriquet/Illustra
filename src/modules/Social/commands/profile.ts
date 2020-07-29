import { Command } from "../../../structures/Command";
import { ICommandContext } from "../../../types";
import IllustraClient from "../../../structures/IllustraClient";
import { CommandResponse } from "../../../structures/CommandResponse";
import { MessageEmbed } from "discord.js";
import { Signs } from "../../../utils/consts";

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
			ctx.channel.send(`${Signs.ERROR} I couldn't find that user!`);
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

class Bio extends Profile{
	constructor(){
		super({
			name: "bio",
			description: "Sets your profile bio, with a max of 200 characters.",
			usage: "[bio]",
			examples: ["Hello. My name is Inigo Montoya."],
			aliases: [],
			userPerms: [],
			botPerms: ["SEND_MESSAGES"],
			reqArgs: 1
		});
	}
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<CommandResponse>{
		
		const bio = ctx.args.join(" ") || "Be different and you'll always stand out.";
		await Illustra.managers.user.setBio(ctx.user.id, bio);
		
		ctx.channel.send("Your bio has been updated!");
		
		return new CommandResponse();
	}
}

class Colour extends Profile{
	constructor(){
		super({
			name: "colour",
			description: "Sets your profile colour.",
			usage: "[hex code]",
			examples: [""],
			aliases: [],
			userPerms: [],
			botPerms: ["SEND_MESSAGES"],
			reqArgs: 1
		});
	}
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<CommandResponse>{
		
		const hexRegex = /^#([A-Fa-f0-9]{6})$/;

		if(!hexRegex.test(ctx.args[0])){
			ctx.channel.send(`${Signs.ERROR} Please enter a valid hex code!`);
			return new CommandResponse();
		}
		
		const colour = parseInt(ctx.args[0].replace("#", "0x"), 16);

		if(!colour){
			ctx.channel.send(`${Signs.ERROR} There was an unexpected error.`);
			return new CommandResponse();
		}

		await Illustra.managers.user.setColour(ctx.user.id, colour);
		ctx.channel.send(`${Signs.SUCCESS} Your profile colour was set!`);

		return new CommandResponse();
	}
}

export const subcommands = [
	new Bio(), new Colour()
];
export default Profile;