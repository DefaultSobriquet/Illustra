import {MessageEmbed} from "discord.js";
import { ICommandContext } from "../../../types";
import { Command } from "../../../structures/Command";
import IllustraClient from "../../../structures/IllustraClient";
import { CommandResponse } from "../../../structures/CommandResponse";
import { Flag } from "../../../structures/Flag";

const options: Partial<Command> = {
    name: "spotify",
    description: "Display a user's current Spotify.",
    usage: "(user)",
    examples: ["", "Sobriquet"],
    aliases: [],
    userPerms: [],
    botPerms: ["SEND_MESSAGES", "EMBED_LINKS"]
};

class Spotify extends Command{
	constructor(){
		super(options);
	}
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<CommandResponse>{
		const member = Illustra.utils.user.resolve(ctx.args[0], ctx.message);
		if (!member){
			ctx.channel.send("I could not find a member matching that.");
			return new CommandResponse("CUSTOM_ERROR", "Member could not be resolved.");
		}
		
		for(const activity of member.presence.activities){
			if(activity.name === "Spotify"){
				
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const syncID = (activity as any).syncID;

				const embed = new MessageEmbed()
					.setDescription(`${member}`)
					.setTimestamp()
					.setAuthor(member.user.tag, member.user.displayAvatarURL())
					.setColor(ctx.guild?.me?.displayColor || 0x2f3136)
					.addField("Song", `[${activity.details}](https://open.spotify.com/track/${syncID})`)
					.addField("Artist", activity.state)
					.addField("Album", activity.assets?.largeText)
					.setThumbnail(activity.assets?.largeImageURL() ?? member.user.displayAvatarURL())
					.setFooter(`Requested by ${ctx.user.tag}`, "https://cdn.discordapp.com/emojis/729052264697823252.png?v=1");

				ctx.channel.send("uri" in ctx.flags ? `Open Song: <spotify://track/${syncID}>` : "", embed);
				return new CommandResponse();
			}
		}
		ctx.channel.send("I could not find a Spotify activity on that user.");
		return new CommandResponse("CUSTOM_ERROR", "No spotify activity found.");
	}
}


export const flags = [
	new Flag({
		name: "uri",
		description: "Provides a URI for the track.",
		hasValue: false
	})
];
export default Spotify;