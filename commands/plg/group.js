import { SlashCommandBuilder } from "discord.js";
import logger from "../../logger.js";
import { membersListId } from "../../members.js";
import { sleep } from "../../utilities.js";
import "dotenv/config";

export const data = new SlashCommandBuilder()
  .setName("group-teams")
  .setDescription("Group teams on the same channel");

export const execute = async (interaction) => {
  const targetChannelId = process.env.CHANNEL_GROUP;
  const results = [];
  try {
    if (!membersListId || !Array.isArray(membersListId)) {
      throw new Error("membersListId is not properly defined");
    }

    for (const memberLoggedIn of membersListId) {
      try {
        const member = await interaction.guild.members.fetch({
          user: memberLoggedIn.discordId,
          timeout: 10000,
        });
        if (!member) {
          results.push(
            `Could not find member with ID ${memberLoggedIn.discordId}`,
          );
          continue;
        }

        // Check if member has a voice state
        if (!member.voice) {
          results.push(`Member ${member.user.tag} is not in a voice channel`);
          continue;
        }

        await member.voice.setChannel(targetChannelId);

        results.push(`Successfully moved ${member.user.tag}`);

        sleep(100);
      } catch (error) {
        results.push(
          `Failed to move ${memberLoggedIn.discordId}: ${error.message}`,
        );
      }
    }
    await interaction.reply({
      content: `Operation completed:\n${results.join("\n")}`,
    });
  } catch (error) {
    logger.error("Error in execute:", error);
    console.error(error);
    logger.info(results);
    await interaction.reply({
      content: "An error occurred while processing the command.",
    });
  }
};
