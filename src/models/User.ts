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
		contrib: {
			type: Boolean
		},
		friend: {
			type: Boolean
		},
		custom: {
			type: String
		}
	}
});

export interface IUser{
	id: string;
	acks: {
		dev?: boolean,
		contrib?: boolean,
		friend?: boolean,
		custom?: string
	}
}

export default model<IUser & Document>("User", User);