import { Schema, model, Document, Types } from "mongoose";

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
		cooldown: {
			type: Number
		},
		count: {
			type: Number
		},
		lastRecieved:{
			emote: {
				type: Types.ObjectId
			},
			timestamp:{
				type: Number
			}
		}
	},
	profile:{
		nickname:{
			type: String
		},
		bio:{
			type: String
		},
		colour:{
			type: Number
		},
		partner:{
			type: Types.ObjectId
		}
	}
});

export interface IUser{
	id: string;
	acks?: {
		dev?: boolean,
		custom?: string[]
	},
	rep?: IRep,
	profile: IProfile
}

export interface IProfile{
	nickname?: string,
	bio?: string,
	colour?: number,
	partner?: Types.ObjectId
}

export interface IRep{
	cooldown?: number,
	count?: number,
	lastRecieved?:{
		emote?: Types.ObjectId,
		timestamp?: number
	}
}

export default model<IUser & Document>("User", User);