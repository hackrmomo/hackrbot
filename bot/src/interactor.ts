import { QueueRepeatMode } from "discord-player";
import { CommandInteraction, Interaction, Message } from "discord.js";
import { client, bot } from "./bot";

const deleteInteractionMessage = async (interaction: CommandInteraction) => {
  setTimeout(async () => {
    await interaction.deleteReply();
  }, 3000);
};

export const performInteraction = async (interaction: Interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  switch (commandName) {
    case "join":
    case "j":
      await interaction.reply({ content: "Joining..." });
      await bot.music.join(interaction.user.id, interaction.guildId);
      await interaction.editReply("Joined!");
      break;
    case "leave":
      await interaction.reply({ content: "Leaving..." });
      await bot.music.leave(interaction.guildId);
      await interaction.editReply("Left!");
      break;
    case "play":
    case "p":
      await interaction.reply({ content: "Playing..." });
      await bot.music.play(interaction.user.id, interaction.guildId, options.get("song").value as string);
      await interaction.editReply(`Playing ${options.get("song").value}!`);
      break;
    case "pause":
      await interaction.reply({ content: "Pausing..." });
      await bot.music.pause(interaction.guildId);
      await interaction.editReply("Paused!");
      break;
    case "resume":
      await interaction.reply({ content: "Resuming..." });
      await bot.music.resume(interaction.guildId);
      await interaction.editReply("Resumed!");
      break;
    case "previous":
    case "prev":
      await interaction.reply({ content: "Playing previous..." });
      await bot.music.previous(interaction.guildId);
      await interaction.editReply("Playing previous!");
      break;
    case "skip":
    case "s":
      await interaction.reply({ content: "Skipping..." });
      await bot.music.skip(interaction.guildId);
      await interaction.editReply("Skipped!");
      break;
    case "queue":
    case "q":
      await interaction.reply({ content: "Reading queue...", ephemeral: true });
      const queue = await bot.music.readQueue(interaction.guildId);
      if (typeof queue.message === "string") {
        await interaction.editReply({ content: "Something is broken!" });
        return;
      }
      if (queue.message.length === 0) {
        await interaction.editReply("Queue is empty!");
        return;
      }
      await interaction.editReply(`Queue: ${queue.message.map((song) => song).join(",\n")}`.substring(0, 2000));
      return;
    case "clear":
    case "c":
      await interaction.reply({ content: "Clearing..." });
      await bot.music.clear(interaction.guildId);
      await interaction.editReply("Cleared!");
      break;
    case "shuffle":
    case "sh":
      await interaction.reply({ content: "Shuffling..." });
      await bot.music.shuffle(interaction.guildId);
      await interaction.editReply("Shuffled!");
      break;
    case "loop":
    case "l":
      await interaction.reply({ content: "Looping..." });
      await bot.music.loop(interaction.guildId, QueueRepeatMode.QUEUE);
      await interaction.editReply("Looped!");
      break;
    case "unloop":
    case "ul":
      await interaction.reply({ content: "Unlooping..." });
      await bot.music.loop(interaction.guildId, QueueRepeatMode.OFF);
      await interaction.editReply("Unlooped!");
      break;
    case "loopsong":
      await interaction.reply({ content: "Looping song..." });
      await bot.music.loop(interaction.guildId, QueueRepeatMode.TRACK);
      await interaction.editReply("Looped song!");
      break;
    case "autoplay":
    case "ap":
      await interaction.reply({ content: "Autoplaying..." });
      await bot.music.loop(interaction.guildId, QueueRepeatMode.AUTOPLAY);
      await interaction.editReply("Autoplayed!");
    case "nowplaying":
    case "np":
      await interaction.reply({ content: "Reading now playing...", ephemeral: true});
      const np = await bot.music.np(interaction.guildId);
      await interaction.editReply(`Now playing: ${np.message}`);
      return;
    case "remove":
    case "rm":
      await interaction.reply({ content: "Removing..." });
      await bot.music.remove(interaction.guildId, options.get("song").value as number);
      await interaction.editReply(`Removed ${options.get("song").value}!`);
      break;
    case "move":
    case "mv":
      await interaction.reply({ content: "Moving..." });
      await bot.music.move(interaction.guildId, options.get("song").value as number, options.get("index").value as number);
      await interaction.editReply(`Moved ${options.get("song").value} to ${options.get("index").value}!`);
      break;
    default:
      await interaction.reply({ content: "Unknown Command" });
      break;
  }
  await deleteInteractionMessage(interaction);
};