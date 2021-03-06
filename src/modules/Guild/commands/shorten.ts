import axios, { AxiosError, AxiosResponse } from "axios";
import { Command } from "../../../structures/Command";
import { ICommandContext } from "../../../types";
import IllustraClient from "../../../structures/IllustraClient";
import { CommandResponse } from "../../../structures/CommandResponse";
import { Signs } from "../../../utils/consts";

const options: Partial<Command> = {
    name: "shorten",
    description: "Shortens a URL with the [Zero Width Shortener](https://zws.im/ 'This is the Zero-Width Shortener site.').",
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
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<CommandResponse>{
	
		axios.get(`https://zws.im/api/shortenURL?url=${ctx.args[0]}`)
			.then((response: AxiosResponse) => {
				ctx.channel.send(`${Signs.SUCCESS} **Here's your ZWS URL for <${ctx.args[0]}>.**\n\`\`\`https://zws.im/${response.data.short}/\`\`\``);
			}).catch((error: AxiosError) => {
				const response = error.response;
				if ([400, 413].includes(response!.status)) return ctx.channel.send(`${Signs.ERROR} Error: ${response!.data.error}.`);
				return ctx.channel.send(`${Signs.ERROR} There was an unexpected error.`);
			});
		
		return new CommandResponse();
	}
}

export default Shorten;
