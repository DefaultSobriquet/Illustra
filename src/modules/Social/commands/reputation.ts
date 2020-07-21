import { Command } from "../../../structures/Command";
import { ICommandContext } from "../../../types";
import IllustraClient from "../../../structures/IllustraClient";
import { CommandResponse } from "../../../structures/CommandResponse";
import ms from "ms";
import { MessageEmbed } from "discord.js";

const options: Partial<Command> = {
    name: "reputation",
    description: "Adds a reputation point to the specified user.",
    usage: "[user] [emote]",
    examples: ["Sobriquet"],
    aliases: ["rep"],
    userPerms: [],
	botPerms: ["SEND_MESSAGES"]
};

class Rep extends Command{
	constructor(){
		super(options);
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<CommandResponse>{
		const time = await Illustra.managers.user.getRepCooldown(ctx.user.id);
		const {props, validate} = Illustra.utils.emote;
		const elapsed = Date.now() - time;
		const cooldown = 72000000;

		if(!ctx.args[0]){
			ctx.channel.send(elapsed <= cooldown ? `You need to wait ${ms(cooldown - elapsed, {long: true})} before you can give reputation.` : `You can give reputation, ${ctx.user.username}!`);
			return new CommandResponse("CUSTOM_ERROR", "Reputation message displayed.");
		}

		// Twenty hours for the reputation time
		if(elapsed <= cooldown){
			ctx.channel.send(`Please wait ${ms(cooldown - elapsed, {long: true})} before attempting to rep a user!`);
			return new CommandResponse("CUSTOM_ERROR", "Reputation cooldown still active.");
		}
		
		const user = Illustra.utils.user.resolve(ctx.args[0], ctx.message);

		if(!user){
			ctx.channel.send("Please specify a valid user!");
			return new CommandResponse("CUSTOM_ERROR", "Specified user was invalid.");
		}

		if(user.id === ctx.user.id){
			ctx.channel.send("You can't give reputation to yourself! Good try, though.");
			return new CommandResponse("CUSTOM_ERROR", "Self-rep attempt.");
		}

		const emote = validate(ctx.args[1]) ? props(ctx.args[1]) : null;

		if(!emote){
			ctx.channel.send("Please specify a valid emote!");
			return new CommandResponse("CUSTOM_ERROR", "Invalid emote.");
		}

		const userDoc = (await Illustra.managers.user.retrieve(user.id, true))!;

		const hasUser = await Illustra.managers.emote.hasUser(emote, userDoc._id);

		if(hasUser){
			ctx.channel.send("The user already has this emote!");
			return new CommandResponse("CUSTOM_ERROR", "User already has emote.");
		}

		await Illustra.managers.emote.addUser(emote, userDoc._id);
		await Illustra.managers.user.addRep(user.id);
		await Illustra.managers.user.setRepCooldown(ctx.user.id);
		
		const embed = new MessageEmbed()
			.setTitle("Emote Collected!")
			.setColor(ctx.guild?.me?.displayColor || 0x2f3136)
			.setDescription(`🎉 ${user} now has ${emote.name} (${emote.id}) in their collection!`)
			.setThumbnail(emote.url!)
			.setFooter(`Given by ${ctx.user.username}`, ctx.user.displayAvatarURL());

		ctx.channel.send(`You've given ${user} a reputation point!`, embed);

		return new CommandResponse();
	}
}

export default Rep;