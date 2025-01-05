import { Events } from "discord.js";
import logger from "../logger.js";
import { membersListId } from "../members.js";
import { toCamelObject, isEmpty } from "../utilities.js";
import { getMemberWithTeam } from "../db/index.js";
export const name = Events.ClientReady;
export const once = true;

export const execute = async (client) => {
  logger.info(`Ready! Logged in as ${client.user.tag}`);
  const guilds = client.guilds.cache;
  const promises = [];

  guilds.forEach(async (guild) => {
    // Log the guild name for debugging
    logger.info(`Processing guild: ${guild.name}`);

    // Defensive checks for guild and its properties
    if (!guild) {
      logger.error("Guild object is undefined");
      return;
    }

    if (!guild.channels) {
      logger.error(`Channels collection is undefined for guild ${guild.name}`);
      return;
    }

    if (!guild.channels.cache) {
      logger.error(`Channels cache is undefined for guild ${guild.name}`);
      return;
    }

    // Log the entire channels cache for debugging
    logger.info(`Channels for guild ${guild.name}:`);

    const voiceChannels = guild.channels.cache.filter(
      (channel) => channel.type === "GUILD_VOICE" || channel.type === 2, // 2 is the numeric representation for voice channels
    );

    for (const [id, channel] of voiceChannels) {
      const membersInChannel = channel.members;

      for (const [memberId, member] of membersInChannel) {
        promises.push(getMemberWithTeam(memberId, "discord_id"));
      }
    }
  });

  const membersInfos = await Promise.all(promises);

  membersInfos.forEach((memberInfos) => {
    const resultQuery = memberInfos[0];

    if (isEmpty(resultQuery)) {
      logger.info("No member info found actually !");
    }

    const formattedMember = toCamelObject(resultQuery);
    if (formattedMember.discordId) {
      membersListId.push(formattedMember);
    } else {
      logger.warn("User has no discordId, not added");
    }
  });

  if (membersListId.length) {
    membersListId.forEach((memberInfos) => {
      logger.info(`Members added ${memberInfos.discordName}`);
    });
  }
};
