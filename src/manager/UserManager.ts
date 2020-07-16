import User, { IUser } from "../models/User";
import IllustraClient from "../structures/IllustraClient";
import { IManagerOptions } from "../types";

class UserManager{
	Illustra: IllustraClient
	constructor(options: IManagerOptions){
		this.Illustra = options.Illustra;
	}
	async retrieve(id: string): Promise<IUser>{
		let user = await User.findOne({id: id});
		if(!user){
			user = await User.create({id: id});
			await user.save();
		}
		return user;
	}
}

export default UserManager;