import { Schema, model, Document } from "mongoose";

const Guild = new Schema({
	id: {
		type: String,
		unique: true,
		required: true
	},
	premium: {
		default: false,
		type: Boolean
	},
	prefix: {
		default: "=",
		type: String
	},
	listing: {
		enabled: {type: Boolean, default: false},
		description: {type: String, default: "I'm a lovely emote server!"}
	}
});

export interface IGuild{
	id: string;
	premium?: boolean;
	prefix?: string
	listing?: {
		enabled: boolean;
		description: string;
	}
}

export default model<IGuild & Document>("Guild", Guild);