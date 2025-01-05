import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("channels")
  .setDescription("Get all channels");

export const execute = async (interaction) => {
  try {
    const guild = interaction.guild;
    const channels = guild.channels.cache;

    let channelList = [];
    channels.forEach((channel) => {
      const channelFormatted = {
        id: channel.id,
        name: channel.name,
        type: channel.type,
      };
      channelList.push(channelFormatted);
    });

    const rowChannels = channelList.map(
      (e) => `${e.id} -- ${e.name} -- ${e.type}`,
    );

    await interaction.reply({
      content: `Voice channels in this server:\n${rowChannels.join("\n")}`,
    });
  } catch (error) {
    console.error("Error:", error);
    await interaction.reply({
      content: "An error occurred while fetching channels.",
    });
  }
};
