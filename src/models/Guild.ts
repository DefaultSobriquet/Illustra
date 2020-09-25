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
	logChannel:{
		type: String
	}
});

export interface IGuild{
	id: string;
	premium?: boolean;
	prefix?: string;
	logChannel?: string;
}

export default model<IGuild & Document>("Guild", Guild);