import { Schema, model, Document } from "mongoose";

const User = new Schema({
	id: {
		type: String,
		unique: true,
		required: true
	},
	acks: {
		dev: {
			type: Boolean
		},
		custom: {
			type: [String]
		}
	},
	rep: {
		lastGiven: {
			type: Number
		},
		count: {
			type: Number
		}
	}
});

export interface IUser{
	id: string;
	acks: {
		dev?: boolean,
		custom?: string[]
	}
}

export default model<IUser & Document>("User", User);