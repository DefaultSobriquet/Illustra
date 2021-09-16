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
	}
});

export interface IUser{
	id: string
	acks?: IAcks
}

export interface IAcks{
	isDev?: boolean,
	custom?: string[]
}

export default model<IUser & Document>("User", User);