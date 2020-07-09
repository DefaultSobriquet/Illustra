class Module{
	name: string;
	description: string;
	enabled: boolean;
	dirname: string;
	icon: string;
	internal: boolean;
	constructor(options: Partial<Module>){
		this.name = options.name ?? "Sample";
		this.description = options.description ?? "This is a sample module." ;
		this.enabled = options.enabled ?? false;
		this.dirname = options.dirname ?? __dirname;
		this.icon = options.dirname ?? "";
		this.internal = options.internal ?? false;
	}
}

export default Module;