import * as dotenv from 'dotenv'
dotenv.config()

import { Client, GatewayIntentBits, Events, type Snowflake } from 'discord.js';
import { logger } from './lib/logger';
import { deployCommands } from '@/lib/commands';
import { commands } from '@/commands';
import { config } from './config';

const client = new Client({ intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.MessageContent
    ]
});

client.once(Events.ClientReady, readyClient => {
	logger.info(`Ready! Logged in as ${readyClient.user.tag}`);
    // Refreshing commands on startup
    logger.info("Started refreshing application (/) commands.");
    readyClient.guilds.cache.forEach(guild => {
        logger.debug(`Refreshing commands for guild ${guild.id}`);
        deployCommands({ guildId: guild.id });
    });
    logger.info("Successfully reloaded application (/) commands.");
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
    try {
        const { commandName } = interaction;
        if (commands[commandName as keyof typeof commands]) {
            await commands[commandName as keyof typeof commands].execute(interaction);
        }
	} catch (error) {
		logger.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.on(Events.GuildCreate, async guild => {
    await deployCommands({ guildId: guild.id });
})

client.login(config.token);