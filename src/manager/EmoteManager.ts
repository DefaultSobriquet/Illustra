import Emote, { IEmote } from "../models/Emote";
import IllustraClient from "../structures/IllustraClient";
import { IManagerOptions } from "../types";
import {Document} from "mongoose";
import { Emoji } from "discord.js";

class EmoteManager{
	Illustra: IllustraClient;
	model: typeof Emote;
	
	constructor(options: IManagerOptions){
		this.Illustra = options.Illustra;
		this.model = Emote;
	}
	async addEmote(emote: Emoji, user?: string): Promise<IEmote & Document>{
		const emoteDoc = await Emote.create({
			id: emote.id,
			name: emote.name,
			animated: emote.animated,
			users: user ? [user] : []
		});
		return await emoteDoc.save();
	}
	async retrieve(emote: Emoji, required = false): Promise<(IEmote & Document)|null>{
		let emoteDoc = await Emote.findOne({id: emote.id});
		if(required && !emoteDoc){
			emoteDoc = await this.addEmote(emote);
		}
		return emoteDoc;
	}
	async hasUser(emote: Emoji, user: string): Promise<boolean>{
		const emoteDoc = await this.retrieve(emote);
		if(!emoteDoc) return false;
		return emoteDoc.users.includes(user);
	}
}

export default EmoteManager;