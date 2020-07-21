import Module from "../../structures/Module";

class System extends Module{
	constructor(){
		super({
			name: "System",
			description: "Internal commands for developers.",
			internal: true
		});
	}
}

export default System;