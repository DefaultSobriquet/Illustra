import { ICommandContext, IObject } from "../../../types";
import { Command } from "../../../structures/Command";
import IllustraClient from "../../../structures/IllustraClient";
import { CommandResponse } from "../../../structures/CommandResponse";
import { Flag } from "../../../structures/Flag";

const options: Partial<Command> = {
    name: "say",
    description: "Make the bot say something.",
    usage: "[...message]",
    examples: ["A towel has immense psychological value."],
    aliases: ["echo", "speak"],
    userPerms: ["MANAGE_MESSAGES"],
    botPerms: ["SEND_MESSAGES", "MANAGE_MESSAGES"],
    reqArgs: 1
};

const smallcaps: IObject = { a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ғ", g: "ɢ", h: "ʜ", i: "ɪ",
                             j: "ᴊ", k: "ᴋ", l: "ʟ", m: "ᴍ", n: "ɴ", o: "ᴏ", p: "ᴘ", q: "ǫ", r: "ʀ",
                             s: "s", t: "ᴛ", u: "ᴜ", v: "ᴠ", w: "ᴡ", x: "x", y: "ʏ", z: "ᴢ" };

class Say extends Command{
	constructor(){
		super(options);
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<CommandResponse>{
        ctx.message.delete().catch();
        
        let message = ctx.args.join(" ");

        if("smallcaps" in ctx.flags){
            let parsed = "";
            for(const substring of message){
                parsed += (smallcaps[substring.toLowerCase()] ?? substring);
            }
            message = parsed;
        }

        ctx.channel.send(message).catch();
        return new CommandResponse();
	}
}


export const flags = [
    new Flag({
        name: "smallcaps",
        description: "Transforms the message into smallcaps.",
        hasValue: false
    })
];

export default Say;