import { getPlayerRole, verifyPlayerToken } from "@/helpers/token_verification";
import { logger } from "@/lib/logger";
import type { Player } from "@/types/CocApi";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("verifyplayer")
  .setDescription("Verify your clash of clans account with the server")
  .addStringOption(option => option.setName('player_tag').setDescription('Your clash of clans player tag').setRequired(true))
  .addStringOption(option => option.setName('token').setDescription('Your verification token').setRequired(true));

export async function execute(interaction: CommandInteraction) {
    logger.info("Verifying player");
    logger.debug("Options: ", interaction.options.data);
    const playerTag = interaction.options.get('player_tag')?.value;
    const token = interaction.options.get('token')?.value;
    
    if (!playerTag || !token) {
        return interaction.reply("Invalid player tag or token");
    }

    const isVerified = await verifyPlayerToken(playerTag as string, token as string);

    if (!isVerified) {
        return interaction.reply("Failed to verify token");
    }
    // Add the verified role to the user
    const member = interaction.member;
    if (!member) {
       logger.warn("Member not exists, cannot add role");
    }
    let verifiedRole = interaction.guild?.roles.cache.find(role => role.name === 'verified'.toLowerCase());
    if (!verifiedRole) {
        logger.warn("Verified role not exists, cannot add role");
        verifiedRole = await interaction.guild?.roles.create({
            name: "verified"
        });
    }

    await member?.roles.add(verifiedRole);

    const playerRole = await getPlayerRole(playerTag as string);
    console.log(playerRole);
    if(!playerRole) {
        return interaction.reply("Seems like you are not a member of the clan");
    }

    // Change nickname to the player Name
    member?.setNickname(playerRole.name);
    
    let roleToAdd = interaction.guild?.roles.cache.find(role => role.name === playerRole.role.toLowerCase());
    if (!roleToAdd) {
        logger.warn("Role not exists, cannot add role, creating");
        roleToAdd = await interaction.guild?.roles.create({
            name: playerRole
        });
    }

    member?.roles.add(roleToAdd);

    return interaction.reply("Verified!");
}