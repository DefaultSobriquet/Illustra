import { Message } from "discord.js";

module.exports = (client: any) => {
	client.utils.users = {
		resolve: (input: string, message: Message) => {
			
			if (!input) return message.member;
			
			const members = message!.guild!.members.cache;

			let target = message!.mentions!.members!.first() || members.find((member) => Boolean((member.user.tag === input) || (member.user.id === input) ||
                (member.user.username === input) || (member.nickname && member.nickname === input)));
			
			target = target || members.find((member) => Boolean(((member.user.username.toLowerCase() + "#" + member.user.discriminator) === input.toLowerCase()) ||
				(member.user.username.toLowerCase() === input.toLowerCase()) || (member.nickname && member.nickname.toLowerCase() === input.toLowerCase())));
	
			target = target || members.find((member) => (member.user.username.startsWith(input)) ||
			(member.user.username.toLowerCase().startsWith(input.toLowerCase())));

			target = target || members.find((member) => Boolean((member.nickname && member.nickname.startsWith(input)) ||
				(member.nickname && member.nickname.toLowerCase().startsWith(input.toLowerCase()))));
				
			target = target || members.find((member) => Boolean((member.user.username.toLowerCase().includes(input.toLowerCase())) ||
				(member.nickname && member.nickname.toLowerCase().includes(input.toLowerCase()))));
			
			return target;
		}
	};
};
