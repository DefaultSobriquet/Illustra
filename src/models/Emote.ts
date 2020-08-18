import { Schema, model, Document } from "mongoose";

const Emote = new Schema({
	id: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	animated:{
		type: Boolean,
		required: true
	},
	users:{
		type: [String],
		required: true
	},
	nsfw:{
		type: Boolean
	}
});

export interface IEmote{
	id: string,
	name: string,
	animated: boolean,
	users: string[],
	nsfw?: boolean
}

export default model<IEmote & Document>("Emote", Emote);