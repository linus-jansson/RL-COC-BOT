import { REST, Routes, type Snowflake } from 'discord.js';
import { commands } from '@/commands';
import { config } from '@/config';
import { logger } from './logger';

const rest = new REST().setToken(config.token);

export async function deployCommands({ guildId }: {
    guildId: Snowflake;
}) {
    try {
  
      await rest.put(
        Routes.applicationGuildCommands(config.clientId, guildId),
        {
          body: commandsData,
        }
      );
  
    } catch (error) {
      logger.error(error);
    }
}

export const commandsData = Object.values(commands).map((command) => command.data);

