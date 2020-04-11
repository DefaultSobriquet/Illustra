const GuildModel = require("./../models/Guild");
module.exports = async (guild) => {
	try{
		const mongoGuild = new GuildModel({id: guild.id});
		await mongoGuild.save();
		console.log(mongoGuild);
	}catch(err){
		console.error(err);
	}
};
