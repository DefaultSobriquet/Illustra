class Module{
	name: string;
	description: string;
	enabled: boolean;
	dirname: string;
	constructor(options: Partial<Module>){
		this.name = "System" ?? options.name;
		this.description = "This is developer module." ?? options.description;
		this.enabled = false ?? options.enabled;
		this.dirname = __dirname;
	}
}