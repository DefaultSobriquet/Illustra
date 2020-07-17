import User, { IUser } from "../models/User";
import IllustraClient from "../structures/IllustraClient";
import { IManagerOptions } from "../types";
import {Document} from "mongoose";

class UserManager{
	Illustra: IllustraClient;
	model: typeof User;
	constructor(options: IManagerOptions){
		this.Illustra = options.Illustra;
		this.model = User;
	}
	async retrieve(id: string): Promise<IUser & Document>{
		let user = await User.findOne({id: id});
		if(!user){
			user = await User.create({id: id});
			await user.save();
		}
		return user;
	}
	async setAcks(id: string, data: string[], merge = true): Promise<IUser & Document>{
		const userDoc = await this.retrieve(id);
		userDoc.acks.custom = (userDoc.acks.custom && merge) ? userDoc.acks.custom.concat(data) : data;
		return await userDoc.save();
	}

}

export default UserManager;