module.exports = (client) => {
	// Command Loader
	client.loadCommand = (commandName) => {
		try {
			console.log(`Loading command: ${commandName}`);
			const props = require(`../commands/${commandName}`);
			if (props.init) {
				props.init(client);
			}
			client.commands.set(props.help.name, props);
			props.conf.aliases.forEach(alias => {
				client.aliases.set(alias, props.help.name);
			});
			return false;
		} catch (e) {
			return `Unable to load command ${commandName}: ${e}`;
		}
	};

	// Clean text of various characters
	client.clean = async (client, text) => {
		if (text && text.constructor.name === "Promise") {
			text = await text;
		}
		if (typeof (text) !== "string") {
			text = require("util").inspect(text, {
				depth: 0
			});
		}
		if (typeof (text) === "string") {
			text = text
				.replace(/`/g, "`" + String.fromCharCode(8203))
				.replace(/@/g, "@" + String.fromCharCode(8203))
				.replace(client.token, "TOKEN");
		}
		return text;
	};

	// Level Checker
	client.permlevel = message => {
		let permlvl = 0;
		const permOrder = client.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);
		while (permOrder.length) {
			const currentLevel = permOrder.shift();
			if (message.guild && currentLevel.guildOnly) continue;
			if (currentLevel.check(message)) {
				permlvl = currentLevel.level;
				break;
			}
		}
		return permlvl;
	};

	// Various utilities
	client.utils = {
		emotes: {
			search: (message, input) => {
				return message.guild.emojis.filter(emote => (
					input.includes(`${emote.name}:${emote.id}`) ||
					input.includes(`${emote.id}`) || input.includes(`${emote.name}`) ||
					(input.toLowerCase()).includes(`${emote.name.toLowerCase()}`)
				));
			},
			props: (input) => {
				let emoteArray = input.replace("<", "").replace(">", "").split(":");
				return {
					"animated": emoteArray[0].includes("a"),
					"name": emoteArray[1],
					"id": emoteArray[2],
					"url": `https://cdn.discordapp.com/emojis/${emoteArray[2]}.${emoteArray[0].includes("a") ? "gif" : "png"}?v=1`
				};
			},
			extract: (message) => {
				let emotes = message.content.match(/<(a*):(.*?):[0-9]+>/g);
				if(!emotes) return [];
				emotes = emotes.filter((emote, index) => (emotes.indexOf(emote) >= index)); // Filter set duplicates
				emotes = emotes.filter((emote) => !message.guild.emojis.has(emote.split(":")[2])); // Filter guild duplicates
				return emotes;
			}
		},
		msFormat: (s) => {
			s = (s - (s % 1000)) / 1000;
			let secs = s % 60;
			s = (s - secs) / 60;
			let mins = s % 60;
			let hrs = ((s - mins) / 60) % 24;
			let days = (((s - mins) / 60) - hrs) / 24;
			return `${days} days, ${hrs} hours, ${mins} minutes, and ${secs} seconds`;
		}
	};
};