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
	
}

export default UserManager;