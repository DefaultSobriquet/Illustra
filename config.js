const config = {
	token: "NjU5MTYwMTYzMzM2MzIzMDky.XgWZLA.IKwP5KcDKBWPciHKC7MfYqNO33I", // This is the bot token.
	name:"Illustra",
	owner:"Sobriquet#0001",
	description: "A simple Discord emote bot", // Description of the bot
	sets: { // Settings
		prefix: "="
	},
	permLevels: [ // Permissions
		{
			level: 0, // Basic level command; return true automatically so all users can run.
			check: () => true
		},
		{
			level: 10,
			check: (message) => (message.member.id === "600826051014426625" ||  message.member.id === "248540313059196928")
		}
	],
	status: [{
		text: "with emotes!",
		type: "PLAYING"
	},{
		text: "the raindrops.",
		type:"LISTENING"
	},{
		text:"the stars.",
		type:"WATCHING"
	},{
		text:"the campfire.",
		type:"WATCHING"
	},{
		text:"with cats!",
		type:"PLAYING"
	},{
		text:"the snow fall.",
		type:"WATCHING"
	},{
		text:"cat videos.",
		type:"WATCHING"
	},{
		text:"a whisper.",
		type:"LISTENING"
	},{
		text:"the sunset.",
		type:"WATCHING"
	},{
		text:"the waves crash.",
		type:"LISTENING"
	},{
		text:"an old record.",
		type:"LISTENING"
	},{
		text:"the waves.",
		type:"WATCHING"
	},{
		text:"the sunrise.",
		type:"WATCHING"
	},{
		text:"the hummingbirds.",
		type:"WATCHING"
	}]
};
  
module.exports = config;