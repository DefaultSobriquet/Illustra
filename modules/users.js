module.exports = (client) => {
	client.utils.users = {
		resolve: (input, message) => {
			if (!input) return message.member;
			let target = message.mentions.members.first();
			if (target == null) {
				target = message.guild.members.cache.find((member) =>
					(member.user.tag === input) || (member.user.id === input) ||
                (member.user.username === input) || (member.nickname !== null && member.nickname === input),
				);
			}
			if (target == null) {
				target = message.guild.members.cache.find((member) =>
					((member.user.username.toLowerCase() + "#" + member.user.discriminator) === input.toLowerCase()) ||
				(member.user.username.toLowerCase() === input.toLowerCase()) || (member.nickname !== null && member.nickname.toLowerCase() === input.toLowerCase()),
				);
			}
			if (target == null) {
				target = message.guild.members.cache.find((member) =>
					(member.user.username.startsWith(input)) ||
				(member.user.username.toLowerCase().startsWith(input.toLowerCase())),
				);
			}
			if (target == null) {
				target = message.guild.members.cache.find((member) =>
					(member.nickname !== null && member.nickname.startsWith(input)) ||
				(member.nickname !== null && member.nickname.toLowerCase().startsWith(input.toLowerCase())),
				);
			}
			if (target == null) {
				target = message.guild.members.cache.find((member) =>
					(member.user.username.toLowerCase().includes(input.toLowerCase())) ||
				(member.nickname !== null && member.nickname.toLowerCase().includes(input.toLowerCase())),
				);
			}
			return target;
		},
	};
};
