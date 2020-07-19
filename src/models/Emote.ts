import { Schema, model, Document, Types} from "mongoose";

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
	userRefs:{
		type: [Types.ObjectId],
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
	userRefs: Types.ObjectId[],
	nsfw?: boolean
}

export default model<IEmote & Document>("Emote", Emote);