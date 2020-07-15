import IllustraClient from "../structures/IllustraClient";

export default async function (Illustra: IllustraClient): Promise<void> {
	// Log that the bot is online and sets the status.
	Illustra.logger.success(`${Illustra.client.user!.tag}, ready to serve ${Illustra.client.users.cache.size} users in ${Illustra.client.guilds.cache.size} servers with ${Illustra.commands.size} commands.`);
	Illustra.client.user!.setActivity(`with emotes! | v${Illustra.version}`, {type: "PLAYING"});
}
