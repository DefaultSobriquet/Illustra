import axios, { AxiosError, AxiosResponse } from "axios";
import { Command } from "../../structures/Command";
import { ICommandContext } from "../../types";
import IllustraClient from "../../structures/IllustraClient";

const options: Partial<Command> = {
    name: "shorten",
    description: "Shortens a URL with the [Zero Width Shortener](https://zws.im/ 'This is the Zero-Width Shortener site.').",
    module: "Guild",
    usage: "[url]",
    examples: ["http://example.com/"],
    aliases: ["short", "zws"],
    userPerms: [],
	botPerms: ["SEND_MESSAGES"],
	reqArgs: 1 
};

class Shorten extends Command{
	constructor(){
		super(options);
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<void>{
		if(!ctx.args[0]){
			ctx.channel.send("Please enter a URL.");
			return;
		}
	
		axios.get(`https://zws.im/api/shortenURL?url=${ctx.args[0]}`)
			.then((response: AxiosResponse) => {
				ctx.channel.send(`**Here's your ZWS URL for <${ctx.args[0]}>.**\n\`\`\`https://zws.im/${response.data.short}/\`\`\``);
			}).catch((error: AxiosError) => {
				const response = error.response;
				if ([400, 413].includes(response!.status)) return ctx.channel.send(`Error: ${response!.data.error}.`);
				return ctx.channel.send("There was an unexpected error.");
			});
	}
}

export default Shorten;
