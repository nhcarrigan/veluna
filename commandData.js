import { SlashCommandBuilder, ChannelType } from "discord.js";

const about = new SlashCommandBuilder()
      .setName("about")
      .setDescription("Get information about the bot.");

const question = new SlashCommandBuilder()
      .setName("questions")
      .setDescription("Configure the PRIVATE text channel where anonymous questions should be sent.")
      .addChannelOption(
        option => option.setName("channel").setDescription("Your question channel.").setRequired(true).addChannelTypes(ChannelType.GuildText)
      );

const answer = new SlashCommandBuilder()
      .setName("answers")
      .setDescription("Configure the PUBLIC text channel where answers should be posted.")
      .addChannelOption(
        option => option.setName("channel").setDescription("Your question channel.").setRequired(true).addChannelTypes(ChannelType.GuildText)
      );

const ask = new SlashCommandBuilder()
      .setName("ask")
      .setDescription("Ask a question!");

console.log(JSON.stringify([
  about.toJSON(),
  question.toJSON(),
  answer.toJSON(),
  ask.toJSON()
]));
