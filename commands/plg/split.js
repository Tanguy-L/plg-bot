import { SlashCommandBuilder } from "discord.js";
import logger from "../../logger.js";
import { membersListId } from "../../members.js";
import "dotenv/config";

export const data = new SlashCommandBuilder()
  .setName("split-teams")
  .setDescription("Split the parties in their channels");

export const execute = async (interaction) => {
  const results = [];
  try {
    for (const memberLoggedIn of membersListId) {
      logger.info(memberLoggedIn.discordId);
      const targetChannelId = memberLoggedIn.teamChannelId;
      try {
        const member = await interaction.guild.members.fetch({
          user: memberLoggedIn.discordId,
          timeout: 6000,
        });
        logger.info(member);
        await member.voice.setChannel(targetChannelId);
        results.push(`Successfully moved ${member.user.tag}`);
      } catch (error) {
        results.push(
          `Failed to move ${memberData.discordId}: ${memberError.message}`,
        );
      }
    }
    await interaction.reply({
      content: `Operation completed:\n${results.join("\n")}`,
    });
  } catch (error) {
    logger.error("Error in execute:", error);
    await interaction.reply({
      content: "An error occurred while processing the command.",
    });
  }
};