// eslint-disable-next-line no-unused-vars
exports.run = async (client, message) => {
	
};
 
exports.conf = {
	aliases: ["whois"],
	permLevel: 0,
	userRequires:["SEND_MESSAGES"],
	requires:["SEND_MESSAGES"]
};

exports.help = {
	name: "userinfo",
	category: "Information",
	description: "Display information about a user.",
	usage: "userinfo (user)",
	example: "userinfo"
};