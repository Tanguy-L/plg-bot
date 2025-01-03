import mysql from "mysql2";
import "dotenv/config";
import logger from "../logger.js";

export const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

connection.connect((error) => {
  if (error) {
    logger.error("Error connecting to database:", error);
    return;
  }
  logger.info("Successfully connected to database");
});

const getMemberWithTeam = (discordId) => {
  return new Promise((resolve, rejects) => {
    const query = `
     SELECT m.*, t.team_id, t.name as team_name, t.channel_id as team_channel_id
     FROM members m
     LEFT JOIN team_members tm ON m.id = tm.member_id  
     LEFT JOIN teams t ON tm.team_id = t.team_id
     WHERE m.discord_id = ?
   `;

    connection.query(
      query,
      [discordId],
      function OnReponse(error, results, fields) {
        if (error) {
          rejects(error);
        }
        const safeResult = results.map((row) => {
          const { discord_id, ...rest } = row;
          return {
            ...rest,
            discord_id: row.discord_id.toString(),
          };
        });
        resolve(safeResult);
      },
    );
  });
};

export { getMemberWithTeam };
