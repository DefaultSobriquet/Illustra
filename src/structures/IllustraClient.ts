import { Client, Collection, ClientEvents, Constants} from "discord.js";
import { IClientOptions, IConfig, IObject} from "../types";
import { Command } from "./Command";
import Utils from "../utils/utils";
import { promisify } from "util";
import { connect } from "mongoose";
import { readdir } from "fs";
import { Signale } from "signale";
import CommandHandler from "./CommandHandler";
import { Flag } from "./Flag";
import UserManager from "../manager/UserManager";
import EmoteManager from "../manager/EmoteManager";
import Module from "./Module";

const areaddir = promisify(readdir);

class IllustraClient{

	client: Client;
	config: IConfig;
	commands: Collection<string, Command>;
	handler: CommandHandler;
	utils: Utils;
	logger: Signale;
	managers: {
		user: UserManager,
		emote: EmoteManager
	}
	cooldowns: Collection<string, (Collection<string, number>)>;
	static signs: IObject;
	version: string;

	constructor(options: IClientOptions){
		this.client = new Client();
		this.config = options.config;
		this.commands = new Collection();
		this.handler = new CommandHandler(this);
		this.utils = new Utils({client: this.client});
		this.logger = new Signale();
		this.managers = {
			user: new UserManager({Illustra: this}),
			emote: new EmoteManager({Illustra: this})
		};
		this.cooldowns = new Collection();
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		this.version = require("../../package.json").version;
	}

	async loadCommand(commandName: string, commandFolder: string, commandModule: Module): Promise<void>{
		try {
			this.logger.await(`Loading command: ${commandName} from ${commandFolder}`);
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			const cmd = require(`../modules/${commandFolder}/commands/${commandName}`);
			const props = new cmd.default();
			if(!props.enabled){
				this.logger.info(`${props.name} disabled, bypassing load.`);
				return;
			}
			if(cmd.subcommands) cmd.subcommands.forEach((c: Command) => {
				props.subcommands.set(c.name, c);
				c.parent = props;
			});
			props.module = commandModule;
			if(cmd.flags) cmd.flags.forEach((f: Flag) => props.flags.set(f.name, f));
			this.commands.set(props.name, props);
		} catch (e) {
			this.logger.error(`Unable to load command ${commandName}: ${e}`);
		}
	}
	
	async loadModules(): Promise<void>{
		const modules = await areaddir("./modules/");
		for (const moduleName of modules) {
			const commands = await areaddir(`./modules/${moduleName}/commands`);
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			const cmdModule = require(`../modules/${moduleName}/${moduleName}`);
			const moduleProps = new cmdModule.default();
			this.logger.await(`Loading ${moduleName} Module: (${commands.length} commands)`);
			for(const file of commands){
				if (!file.endsWith(".js")) return;
				await this.loadCommand(file, moduleName, moduleProps);
			}
		}
	}
	
	async loadEvents(): Promise<void>{
		const evtFiles = await areaddir("./events/");
		this.logger.await(`Loading Events (Total ${evtFiles.length})`);
		evtFiles.forEach((file) => {
			const eventName = file.split(".")[0];
			this.logger.await(`Loading Event: ${eventName}`);
			try{
				// eslint-disable-next-line @typescript-eslint/no-var-requires
				const event = require(`../events/${file}`).default;
			
				// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-inner-declarations
				function isEvent(input: any): input is keyof ClientEvents {
					return (Object.values(Constants.Events).includes(input));
				}
				
				if(!isEvent(eventName)){
					this.logger.error(`${eventName} is not an event!`);
					return;
				}

				this.client.on(eventName, event.bind(null, this));
			}catch(e){
				this.logger.error(e);
			}
		});
	}
	
	async init(): Promise<void>{
		try{
			await this.loadModules();
			await this.loadEvents();
			connect(`mongodb+srv://${this.config.mongo.username}:${this.config.mongo.password}@${this.config.mongo.database}/${this.config.name}?retryWrites=true&w=majority`, {
				useNewUrlParser: true,
				useFindAndModify: false,
				useUnifiedTopology: true,
				useCreateIndex: true
			}, (err) => {
				if (err) this.logger.error(err);
			});
			this.client.login(this.config.token);
		}catch(e){
			this.logger.error(e);
		}
	}
	
}

export default IllustraClient;