import axios from "axios";
import { Command } from "../../structures/Command";
import { ICommandContext } from "../../types";

const options = {
    name: "shorten",
    description: "Shortens a URL with the [Zero Width Shortener](https://zws.im/ 'This is the Zero-Width Shortener site.').",
    module: "Guild",
    usage: "[url]",
    examples: ["http://example.com/"],
    aliases: ["short", "zws"],
    userPerms: [],
    botPerms: ["SEND_MESSAGES"]
}

class Shorten extends Command{
	constructor(){
		super(options);
	}
	async execute(ctx: ICommandContext, client: any){
		if(!ctx.args[0]) return ctx.channel.send("Please enter a URL.");
	
		axios.get(`https://zws.im/api/shortenURL?url=${ctx.args[0]}`)
			.then((response: any) => {
				ctx.channel.send(`**Here's your ZWS URL for <${ctx.args[0]}>.**\n\`\`\`https://zws.im/${response.data.short}/\`\`\``);
			}).catch((error: any) => {
				const response = error.response;
				if ([400, 413].includes(response.status)) return ctx.channel.send(`Error: ${response.data.error}.`);
				return ctx.channel.send("There was an unexpected error.");
			});
	}
}

export default Shorten;