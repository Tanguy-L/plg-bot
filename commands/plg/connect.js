import {
  ActionRowBuilder,
  SlashCommandBuilder,
  ButtonStyle,
  ButtonBuilder,
  EmbedBuilder,
} from "discord.js";
import "dotenv/config";

export const data = new SlashCommandBuilder()
  .setName("connect")
  .setDescription("The button to connect to the server");

export const execute = async (interaction) => {
  const connectionCommand = "connect localhost;password flash;";
  const urlButtonConnection = process.env.URL_BUTTON_CONNECTION;

  const serverEmbed = new EmbedBuilder()
    .setTitle("PLG: Party Lan Gaming") // Setting the title you requested
    .setDescription("venez vous battre !") // Adding the French description
    .setThumbnail(
      "https://cdn.akamai.steamstatic.com/apps/csgo/images/csgo_react/social/cs2.jpg",
    ) // Using the server's icon as thumbnail
    .setColor("#5865F2") // Setting a Discord-blue color for the embed
    .addFields(
      { name: "commande de connexion :", value: connectionCommand }, // Adding the connection command text
    );

  const connectButton = new ButtonBuilder()
    .setLabel("Connect")
    .setCustomId("steam-connect") // We'll use this ID to handle the interaction
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder().addComponents(connectButton);

  // Sending the response with both the embed and the button
  await interaction.reply({
    embeds: [serverEmbed], // Including our embed
    components: [row], // Including our button row
  });

  if (interaction.customId === "steam-connect") {
    await interaction.reply({
      content: `Steam connect link: steam://connect/localhost\nCopy and paste this into your browser to connect.`,
    });
  }
};
