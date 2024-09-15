import type { Snowflake } from 'discord.js'

if (!process.env.DISCORD_TOKEN || !process.env.DISCORD_CLIENT_ID) {
    console.error('DISCORD_TOKEN or DISCORD_CLIENT_ID is not set.');
    process.exit(1);
}

export const config = {
    token: process.env.DISCORD_TOKEN,
    clientId: process.env.DISCORD_CLIENT_ID as Snowflake,
    apiToken: process.env.CLASH_OF_CLANS_API_KEY
}