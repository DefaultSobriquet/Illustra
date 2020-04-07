module.exports = (client) => {
	client.utils.users = {
		resolve: (input, message) => {
			
			if (!input) return message.member;
			
			const members = message.guild.members.cache;

			let target = message.mentions.members.first() || members.find((member) => (member.user.tag === input) || (member.user.id === input) ||
                (member.user.username === input) || (member.nickname && member.nickname === input));
			
			target = target || members.find((member) => ((member.user.username.toLowerCase() + "#" + member.user.discriminator) === input.toLowerCase()) ||
				(member.user.username.toLowerCase() === input.toLowerCase()) || (member.nickname && member.nickname.toLowerCase() === input.toLowerCase()));
	
			target = target || members.find((member) => (member.user.username.startsWith(input)) ||
			(member.user.username.toLowerCase().startsWith(input.toLowerCase())));

			target = target || members.find((member) => (member.nickname && member.nickname.startsWith(input)) ||
				(member.nickname && member.nickname.toLowerCase().startsWith(input.toLowerCase())));
				
			target = target || members.find((member) => (member.user.username.toLowerCase().includes(input.toLowerCase())) ||
				(member.nickname && member.nickname.toLowerCase().includes(input.toLowerCase())));
			
			return target;
		}
	};
};
