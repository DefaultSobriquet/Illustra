import { ICommandContext } from "../../../types";
import { Command } from "../../../structures/Command";
import IllustraClient from "../../../structures/IllustraClient";
import { CommandResponse } from "../../../structures/CommandResponse";
import YoutubeDL from "youtube-dl-exec";

const options: Partial<Command> = {
    name: "ytdl",
    description: "Downloads an audio file from Youtube.",
    usage: "[Youtube Link]",
    examples: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
    aliases: [],
    userPerms: [],
    botPerms: ["SEND_MESSAGES"],
    devOnly: true
};

class Ytdl extends Command{
	constructor(){
		super(options);
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<CommandResponse>{
        const url = ctx.args.join(" ");
        YoutubeDL(url, {
            "format": "bestaudio",
            "o": "~/Desktop/Music/%(title)s.%(ext)s",
            "default-search": "auto"
        })
            .then(output => ctx.channel.send(`\`\`\`\n${output}\`\`\``))
            .catch(() => ctx.channel.send("An error was found! Make sure you're entering a valid Youtube id."));

		return new CommandResponse();
	}
}

export default Ytdl;