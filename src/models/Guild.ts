const {Schema, model} = require("mongoose");

const Guild = Schema({
	id: {
		type: String,
		unique: true,
		required: true
	},
	premium: {
		default: false,
		type: Boolean
	},
	prefix: {
		default: "=",
		type: String
	},
	listing: {
		enabled: {type: Boolean, default: false},
		description: {type: String, default: "I'm a lovely emote server!"}
	}
});

module.exports = model("Guild", Guild);