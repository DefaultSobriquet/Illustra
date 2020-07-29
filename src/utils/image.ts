import { Client, Collection } from "discord.js";
import Jimp from "jimp";
import { IUtilsOptions } from "../types";

class ImageUtils{
	// This needs to be fixed, but for now, I'm too tired of TypeScript to figure it out.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	methods: Collection<string, any>;
	client: Client;
	constructor(options: IUtilsOptions){
		this.client = options.client;
		const jimpEntries = new Collection(Object.entries(Jimp.prototype));
		this.methods = jimpEntries.filter(e => typeof(e) === "function");
	}
	async process(url: string, options: Record<string, unknown[]>): Promise<Jimp>{
		const image = await Jimp.read(url);
		for(const name in options){
			if(!this.methods.has(name)) continue;
			await this.methods.get(name).bind(image, ...options[name]);
		}
		return image;
	}
}

export default ImageUtils;