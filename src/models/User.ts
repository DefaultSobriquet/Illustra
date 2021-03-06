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
	id: string;
	acks?: IAcks,
	rep?: IRep,
	profile: IProfile
}

export interface IAcks{
	dev?: boolean,
	custom?: string[]
}

export interface IProfile{
	nickname?: string,
	bio?: string,
	colour?: number,
	partner?: string
}

export interface IRep{
	cooldown?: number,
	count?: number,
	lastRecieved?:{
		emote?: string,
		timestamp?: number
	}
}

export default model<IUser & Document>("User", User);