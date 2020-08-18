import User, { IAcks, IProfile, IRep, IUser } from "../models/User";
import IllustraClient from "../structures/IllustraClient";
import { IManagerOptions } from "../types";
import {Document} from "mongoose";

// Hack declaration for extending the prototype
declare module "discord.js" {
	interface User{
		acks: IAcks;
		rep: IRep;
		profile: IProfile;
	}
}

class UserManager{
	
	Illustra: IllustraClient;
	model: typeof User;
	
	constructor(options: IManagerOptions){
		this.Illustra = options.Illustra;
		this.model = User;
	}
	
	async retrieve(id: string, required = false): Promise<(IUser & Document)|null>{
		let user = await User.findOne({id: id});
		if(!user && required){
			user = await User.create({id: id});
			await user.save();
		}
		return user;
	}
	
	async setAcks(id: string, data: string[], merge = true): Promise<IUser & Document>{
		const userDoc = (await this.retrieve(id, true))!;
		userDoc.acks!.custom = (userDoc.acks?.custom && merge) ? userDoc.acks!.custom.concat(data) : data;
		return await userDoc.save();
	}

	async addRep(id: string): Promise<IUser & Document>{
		const userDoc = (await this.retrieve(id, true))!;
		userDoc.rep!.count = userDoc.rep?.count ? userDoc.rep.count+1 : 1;
		return await userDoc.save();
	}
	
	async setRepCooldown(id: string, time = Date.now()): Promise<IUser & Document>{
		const userDoc = (await this.retrieve(id, true))!;
		userDoc.rep!.cooldown = time;
		return await userDoc.save();
	}

	async setBio(id: string, bio: string): Promise<IUser & Document>{
		const userDoc = (await this.retrieve(id, true))!;
		userDoc.profile.bio = bio.length < 500 ? bio : bio.slice(0, 500).trim()+"...";
		return await userDoc.save();
	}

	async setColour(id: string, colour: number): Promise<IUser & Document>{
		const userDoc = (await this.retrieve(id, true))!;
		userDoc.profile.colour = colour;
		return await userDoc.save();
	}

	async getProfile(id: string): Promise<IProfile>{
		const userDoc = await this.retrieve(id);
		const profile = {
			nickname: userDoc?.profile?.nickname,
			colour: userDoc?.profile?.colour,
			bio: userDoc?.profile?.bio ?? "Be different and you'll always stand out.",
			partner: userDoc?.profile?.partner
		};
		return profile;
	}

	async getRepCooldown(id: string): Promise<number>{
		const userDoc = await this.retrieve(id);
		return userDoc?.rep?.cooldown ?? 0;
	}

	async getRep(id: string): Promise<IRep>{
		const userDoc = await this.retrieve(id);
		return {
			count: userDoc?.rep?.count ?? 0,
			cooldown: userDoc?.rep?.cooldown ?? 0,
			lastRecieved: {
				emote: userDoc?.rep?.lastRecieved?.emote,
				timestamp: userDoc?.rep?.lastRecieved?.timestamp
			}
		};
	}
	
}

export default UserManager;