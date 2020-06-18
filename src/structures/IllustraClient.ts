import { Client, Collection } from "discord.js";
import { IClientOptions, IConfig} from "../types";
import { Command } from "./Command";
import Utils from "../utils/utils";
import {promisify} from "util";
const readdir = promisify(require("fs").readdir);
import {connect} from "mongoose";

class IllustraClient{
	client: Client;
	config: IConfig;
	commands: Collection<string, Command>;
	utils: Utils;
	constructor(options: IClientOptions){
		this.client = new Client();
		this.config = options.config;
		this.commands = new Collection();
		this.utils = new Utils({client: this.client});
	}

	async loadCommand(commandName: string, commandFolder: string): Promise<Boolean|String>{
		try {
			console.log(`Loading command: ${commandName} from ${commandFolder}`);
			const cmd = require(`../modules/${commandFolder}/${commandName}`).default;
			const props = new cmd();
			if (props.init) {
				props.init(this.client);
			}
			this.commands.set(props.name, props);
			return false;
		} catch (e) {
			return `Unable to load command ${commandName}: ${e}`;
		}
	}
	
	clean(text: string){
		if (typeof (text) !== "string") {
			text = require("util").inspect(text, {
				depth: 0
			});
		}
		if (typeof (text) === "string") {
			text = text
				.replace(/`/g, "`" + String.fromCharCode(8203))
				.replace(/@/g, "@" + String.fromCharCode(8203))
				.replace(this.client.token!, "TOKEN");
		}
		return text;
	};
	
	async loadModules(){
		const cmdFolders = await readdir("./modules/");
		for (const folder of cmdFolders) {
			const cmdFiles = await readdir(`./modules/${folder}/`);
			console.log(`Loading ${folder} Module (${cmdFiles.length} commands)`);
			cmdFiles.forEach((file: string) => {
				if (!file.endsWith(".js")) return;
				const response = this.loadCommand(file, folder);
				if (response) console.log(response);
			});
		}
	};
	
	async loadEvents(){
		const evtFiles = await readdir("./events/");
		console.log(`Loading Events (Total ${evtFiles.length})`);
		evtFiles.forEach((file: string) => {
			const eventName = file.split(".")[0];
			console.log(`Loading Event: ${eventName}`);
			const event = require(`../events/${file}`).default;
			this.client.on(eventName, event.bind(null, this));
		});
	}
	
	async init(): Promise<any>{
		try{
			await this.loadModules();
			await this.loadEvents();
			connect(`mongodb+srv://${this.config.mongo.username}:${this.config.mongo.password}@${this.config.mongo.database}/${this.config.name}?retryWrites=true&w=majority`, {
				useNewUrlParser: true,
				useFindAndModify: false,
				useUnifiedTopology: true,
				useCreateIndex: true
			}, (err) => {
				if (err) console.error(err);
			});
			this.client.login(this.config.token);
		}catch(e){
			console.error(e);
		}
	};
}

export default IllustraClient;