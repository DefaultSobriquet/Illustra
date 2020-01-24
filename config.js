const status = require("./resources/status.js");
const config = {
	token: "NjU5MTYwMTYzMzM2MzIzMDky.XgWZLA.IKwP5KcDKBWPciHKC7MfYqNO33I", // This is the bot token.
	name: "Illustra",
	owner: "Sobriquet#0001",
	description: "A simple emote management bot.", // Description of the bot
	support: "https://discord.gg/gFv6Bpp",
	invite: "https://discordapp.com/api/oauth2/authorize?client_id=659160163336323092&permissions=1141763265&scope=bot",
	sets: { // Settings
		prefix: "_"
	},
	api_tokens: {
		thecatapi: "ab08e4a4-95cc-46ce-b980-a499daf97270",
		thedogapi: "5c9cb91b-91f3-4650-8704-6c6b8c709edc"
	},
	permLevels: [ // Permissions
		{
			level: 0, // Basic level command; return true automatically so all users can run.
			check: () => true
		},
		{
			level: 10,
			check: (message) => (message.member.id === "600826051014426625" || message.member.id === "248540313059196928")
		}
	],
	status: status
};
  
module.exports = config;