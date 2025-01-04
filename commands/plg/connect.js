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
  const connectionCommand = process.env.CONNECTION_COMMAND;
  const urlButtonConnection = process.env.URL_BUTTON_CONNECTION;

  const serverEmbed = new EmbedBuilder()
    .setTitle("PLG: Party Lan Gaming")
    .setDescription("Venez vous battre !")
    .setThumbnail(
      "https://cdn.akamai.steamstatic.com/apps/csgo/images/csgo_react/social/cs2.jpg",
    )
    .setColor("#5865F2")
    .addFields({ name: "commande de connexion :", value: connectionCommand });

  // const connectButton = new ButtonBuilder()
  //   .setLabel("Connect")
  //   .setCustomId("steam-connect")
  //   .setStyle(ButtonStyle.Primary);

  // const row = new ActionRowBuilder();

  await interaction.reply({
    embeds: [serverEmbed], // Including our embed
    // components: [row], // Including our button row
  });
};
