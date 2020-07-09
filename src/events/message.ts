import { Message } from "discord.js";
import IllustraClient from "../structures/IllustraClient";

export default async function (Illustra: IllustraClient, message: Message): Promise<void> {
	Illustra.handler.handle(message);
}
