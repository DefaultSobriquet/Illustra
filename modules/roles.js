module.exports = (client) => {
	client.utils.roles = {
		resolve: (input, message) => {
			if(!input) return message.guild.defaultRole;
			let role = message.guild.roles.find(role => role.id === input);
			if(role == null) role = message.guild.roles.find(role => role.name.startsWith(input));
			if(role == null) role = message.guild.roles.find(role => role.name.toLowerCase().startsWith(input.toLowerCase()));
			return role;
		}
	};
};