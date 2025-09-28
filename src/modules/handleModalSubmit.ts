/**
 * @copyright NHCarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */

import { MessageFlags, type ModalSubmitInteraction } from "discord.js";
import type { Veluna } from "../interfaces/veluna.js";

/**
 * Handles modal submissions.
 * @param veluna - Veluna's instance.
 * @param interaction - The modal submit interaction payload from Discord.
 */
// eslint-disable-next-line max-lines-per-function, complexity, max-statements -- Big boi function.
export const handleModalSubmit = async(
  veluna: Veluna,
  interaction: ModalSubmitInteraction,
): Promise<void> => {
  await interaction.deferReply({ flags: [ MessageFlags.Ephemeral ] });
  if (!interaction.inCachedGuild()) {
    await interaction.editReply({
      content: "This interaction can only be used in a server.",
    });
    return;
  }

  const record = await veluna.db.servers.findUnique({
    where: {
      serverId: interaction.guildId,
    },
  });

  if (!record) {
    await interaction.editReply({
      content:
        // eslint-disable-next-line stylistic/max-len -- Big boi string.
        "This server is not registered in the database. Please configure your settings.",
    });
    return;
  }

  if (interaction.customId === "ask") {
    if (record.questionChannelId === "") {
      await interaction.editReply({
        content: "This server has not set a question channel.",
      });
      return;
    }
    if (record.blockedUsers.includes(interaction.user.id)) {
      await interaction.editReply({
        content: "You are blocked from asking questions in this server.",
      });
      return;
    }
    const question = interaction.fields.getTextInputValue("textinput");
    const channel
      = veluna.discord.channels.cache.get(record.questionChannelId)
      ?? await veluna.discord.channels.fetch(record.questionChannelId).
        catch(() => {
          return null;
        });
    if (channel?.isSendable() !== true) {
      await interaction.editReply({
        content: "The question channel set is not a text-based channel.",
      });
      return;
    }
    await channel.send({
      components: [
        {
          components: [
            {
              // eslint-disable-next-line @typescript-eslint/naming-convention -- Discord API.
              custom_id: "answer",
              label:     "Answer this question",
              style:     3,
              type:      2,
            },
            {
              // eslint-disable-next-line @typescript-eslint/naming-convention -- Discord API.
              custom_id: `block-${interaction.user.id}`,
              label:     "Block user",
              style:     4,
              type:      2,
            },
            {
              disabled: false,
              label:    "Donate to Naomi?",
              style:    5,
              type:     2,
              url:      "https://donate.nhcarrigan.com",
            },
            {
              disabled: false,
              label:    "NHCarrigan Discord",
              style:    5,
              type:     2,
              url:      "https://chat.nhcarrigan.com",
            },
          ],
          type: 1,
        },
      ],
      content: question,
    });
    await interaction.editReply({
      content: "Your question has been submitted.",
    });
    return;
  }

  if (interaction.customId === "answer") {
    if (record.answerChannelId === "") {
      await interaction.editReply({
        content: "This server has not set an answer channel.",
      });
      return;
    }
    const { message, fields } = interaction;
    if (!message) {
      await interaction.editReply({
        content: "An error occurred while fetching the message.",
      });

      return;
    }
    const { content: question } = message;
    const answer = fields.getTextInputValue("textinput");

    if (question === "") {
      await interaction.editReply({
        content: "An error occurred while fetching the question.",
      });
    }
    const channel
      = veluna.discord.channels.cache.get(record.answerChannelId)
      ?? await veluna.discord.channels.fetch(record.answerChannelId).
        catch(() => {
          return null;
        });
    if (channel?.isSendable() !== true) {
      await interaction.editReply({
        content: "The answer channel set is not a text-based channel.",
      });
      return;
    }
    await channel.send({
      components: [
        {
          // eslint-disable-next-line @typescript-eslint/naming-convention -- Discord API.
          accent_color: null,
          components:   [
            {
              content: `# ${question}`,
              type:    10,
            },
            {
              divider: true,
              spacing: 1,
              type:    14,
            },
            {
              content: answer,
              type:    10,
            },
            {
              divider: true,
              spacing: 1,
              type:    14,
            },
            {
              content: `-# Brought to you by [NHCarrigan](<https://chat.nhcarrigan.com>)`,
              type:    10,
            },
          ],
          spoiler: false,
          type:    17,
        },
        {
          components: [
            {
              // eslint-disable-next-line @typescript-eslint/naming-convention -- Discord API.
              custom_id: "ask",
              disabled:  false,
              label:     "Ask your own?",
              style:     3,
              type:      2,
            },
            {
              disabled: false,
              label:    "Donate to Naomi?",
              style:    5,
              type:     2,
              url:      "https://google.com",
            },
            {
              disabled: false,
              label:    "NHCarrigan Discord",
              style:    5,
              type:     2,
              url:      "https://google.com",
            },
          ],
          type: 1,
        },
      ],
      flags: [ MessageFlags.IsComponentsV2 ],
    });
    await message.delete();
    await interaction.editReply({
      content: "Your answer has been submitted.",
    });
  }
};
