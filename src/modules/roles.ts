import { Message } from "discord.js";

export const roles = (client: any) => {
	client.utils.roles = {
		resolve: (input: string, message: Message) => {
			if (!input) return null;
			let role = message!.guild!.roles.cache.find((role) => role.id === input);
			role = role || message!.guild!.roles.cache.find((role) => role.toString() === input);
			role = role || message!.guild!.roles.cache.find((role) => role.name === input)
			role = role || message!.guild!.roles.cache.find((role) => role.name.startsWith(input));
			role = role || message!.guild!.roles.cache.find((role) => role.name.toLowerCase().startsWith(input.toLowerCase()));
			return role;
		}
	};
};
