import { Command } from "../../structures/Command";
import { ICommandContext } from "../../types";
import IllustraClient from "../../structures/IllustraClient";

const options: Partial<Command> = {
    name: "upload",
    description: "Add an emote to the server with either a link, emote, or attachment.",
    module: "Emotes",
    usage: "[name] (link/attachment/emote)",
    examples: ["rooThink https://cdn.discordapp.com/emojis/511919341281738773.png?v=1", "rooThink pandaThink"],
    aliases: ["add"],
    userPerms: ["MANAGE_EMOJIS"],
    botPerms: ["SEND_MESSAGES", "MANAGE_EMOJIS", "EMBED_LINKS"]
};

class Upload extends Command{
	constructor(){
		super(options);
	}
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<void>{
		const { embed, props, space, validate } = Illustra.utils.emote;
	
		const calculated = space(ctx.guild!);
		const a = calculated.animated;
		const s = calculated.static;
		const regName = /^[_a-z0-9]{2,32}$/i;
		const regLink = /^https?:\/\//;
	
		const file = ctx.message.attachments.first();
		
		let name = (ctx.args[0] && regName.test(ctx.args[0])) ? ctx.args[0] : undefined;
		let link = (name && ctx.args[1] && regLink.test(ctx.args[1])) ? ctx.args[1] : undefined;
	
		if(file){ // Alright, let's start using the attachment.
			if(!(file.size <= 256000 && /\.(gif|png|jpg|jpeg|webp)$/.test(file.url))){
				ctx.channel.send("Nope! That's an invalid attachment (over 256 KB or not a valid image).");
				return;
			}
			
			if(!a && /\.gif$/.test(file.url)){
				ctx.channel.send("Slow down! You don't have space for an animated emote.");
				return;
			}
			if(!s && /\.(png|jpg|jpeg|webp)$/.test(file.url)){
				ctx.channel.send("Slow down! You don't have space for an static emote.");
				return;
			}
	
			if(regName.test(file.name ?? "")) name = file.name;
			link = file.url;
		}
	
		if(!link && validate(ctx.args[1])) link = props(ctx.args[1])?.url ?? undefined;
	
		if(!name){
			ctx.channel.send("You didn't give me a valid emote name."); // Is the name valid?
			return;
		}

		if(!link){
			ctx.channel.send("You didn't give me a valid link, emote, or attachment."); // Did we get a link?
			return;
		}
	
		ctx.guild!.emojis.create(link, name, {reason: `Added by ${ctx.user.tag}`})
			.then(emote => ctx.channel.send(embed(emote, ctx.message)))
			.catch(err => {
				console.error(err);
				ctx.channel.send("There was an error! Your link might have been an invalid image.");
			});
	}
}

export default Upload;