import { Events } from "discord.js";
import { membersListId } from "../members.js";
import { getMemberWithTeam } from "../db/index.js";
import logger from "../logger.js";
export const name = Events.VoiceStateUpdate;

function toCamelObject(o) {
  var newO, origKey, newKey, value;
  if (o instanceof Array) {
    return o.map(function (value) {
      if (typeof value === "object") {
        value = toCamelObject(value);
      }
      return value;
    });
  } else {
    newO = {};
    for (origKey in o) {
      if (o.hasOwnProperty(origKey)) {
        newKey = snakeToCamel(origKey);
        value = o[origKey];
        if (
          value instanceof Array ||
          (value !== null && value.constructor === Object)
        ) {
          value = toCamelObject(value);
        }
        newO[newKey] = value;
      }
    }
  }
  return newO;
}

const snakeToCamel = (str) =>
  str
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group) =>
      group.toUpperCase().replace("-", "").replace("_", ""),
    );

export const execute = async (oldState, newState) => {
  const id = newState.id.toString();

  if (oldState.channelId === null) {
    try {
      const memberInfo = await getMemberWithTeam(id, "discord_id");
      const formattedMember = toCamelObject(memberInfo[0]);
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
