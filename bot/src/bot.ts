import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import { commands } from "./config";
import { music } from "./music";
import "./api"

export const client = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildVoiceStates,
] });

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;
  switch (commandName) {
    default:
      await interaction.reply("Unknown command");
  }
});

const startBot = (async () => {
  await client.login(process.env.HACKRBOT_TOKEN);
  const rest = new REST({ version: "10" }).setToken(process.env.HACKRBOT_TOKEN!);

  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(
      Routes.applicationCommands(
        process.env.DISCORD_CLIENT_ID!,
      ),
      {
        body: commands,
      }
    );

    console.log("Successfully reloaded application (/) commands.");

  } catch (error) {
    console.error(error);
  }
});

startBot();

const healthCheck : (finalCheck: boolean) => Promise<{ status: "error" | "ok" }> = async (finalCheck = false) => {
  if (client) {
    return { status: "ok" };
  } else {
    if (finalCheck) return { status: "error" };
    await startBot();
    return await healthCheck(true);
  };
};

export const bot = {
  healthCheck,
  music
};