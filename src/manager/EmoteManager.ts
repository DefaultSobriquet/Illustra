import Emote, { IEmote } from "../models/Emote";
import IllustraClient from "../structures/IllustraClient";
import { IManagerOptions } from "../types";
import {Document, Types} from "mongoose";
import { Emoji } from "discord.js";

class EmoteManager{
	Illustra: IllustraClient;
	model: typeof Emote;
	
	constructor(options: IManagerOptions){
		this.Illustra = options.Illustra;
		this.model = Emote;
	}
	async addEmote(emote: Emoji, user?: Types.ObjectId): Promise<IEmote & Document>{
		const emoteDoc = await Emote.create({
			id: emote.id,
			name: emote.name,
			animated: emote.animated,
			userRefs: user ? [user] : []
		});
		return await emoteDoc.save();
	}
	async addUser(emote: Emoji, user: Types.ObjectId): Promise<IEmote & Document>{
		const emoteDoc = (await this.retrieve(emote, true))!;
		emoteDoc.userRefs.push(user);
		await this.Illustra.managers.user.model.findByIdAndUpdate(user, {
			"rep.lastRecieved":{
				emote: emoteDoc._id,
				timestamp: Date.now()
			}
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
	async hasUser(emote: Emoji, user: Types.ObjectId): Promise<boolean>{
		const emoteDoc = await this.retrieve(emote);
		if(!emoteDoc) return false;
		return emoteDoc.userRefs.includes(user);
	}
}

export default EmoteManager;