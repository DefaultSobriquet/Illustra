import IllustraClient from "../structures/IllustraClient";
import { IManagerOptions } from "../types";

class PermissionManagers{
	Illustra: IllustraClient;
	constructor(options: IManagerOptions){
		this.Illustra = options.Illustra;
	}
}