module.exports = (client) => {
	client.utils.roles = {
		resolve: (input, message) => {
			if (!input) return null;
			let role = message.guild.roles.cache.find((role) => role.id === input);
			role = role || message.guild.roles.cache.find((role) => role === input);
			role = role || message.guild.roles.cache.find((role) => role.name.startsWith(input));
			role = role || message.guild.roles.cache.find((role) => role.name.toLowerCase().startsWith(input.toLowerCase()));
			return role;
		}
	};
};
