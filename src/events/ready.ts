import IllustraClient from "../structures/IllustraClient";

export default async function (Illustra: IllustraClient): Promise<void> {
	// Log that the bot is online and sets the status.
	console.log(`${Illustra.client.user!.tag}, ready to serve ${Illustra.client.users.cache.size} users in ${Illustra.client.guilds.cache.size} servers with ${Illustra.commands.size} commands.`);
}
