import { Events } from "discord.js";
import { membersListId } from "../members.js";
import { getMemberWithTeam } from "../db/index.js";
import logger from "../logger.js";
import { toCamelObject, isEmpty } from "../utilities.js";
export const name = Events.VoiceStateUpdate;

export const execute = async (oldState, newState) => {
  const id = newState.id.toString();

  if (oldState.channelId === null) {
    try {
      const memberInfo = await getMemberWithTeam(id, "discord_id");

      if (isEmpty(memberInfo)) {
        logger.info("No member info found actually !");
        return;
      }

      const member = memberInfo[0];

      const formattedMember = toCamelObject(member);
      membersListId.push(formattedMember);
    } catch (error) {
      logger.error(error);
    }
  }

  if (newState.channelId === null) {
    const indexMember = membersListId.findIndex((e) => e.discordId === id);
    membersListId.splice(indexMember, 1);
  }
};
