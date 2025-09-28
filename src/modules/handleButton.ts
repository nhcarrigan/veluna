/**
 * @copyright NHCarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */

import {
  MessageFlags,
  PermissionFlagsBits,
  type ButtonInteraction,
} from "discord.js";
import { answer } from "../modals/answer.js";
import { ask } from "../modals/ask.js";
import type { Veluna } from "../interfaces/veluna.js";

/**
 * Displays the appropriate modal when a button is pressed.
 * @param veluna - Veluna's instance.
 * @param interaction - The button interaction payload from Discord.
 */
// eslint-disable-next-line max-lines-per-function , max-statements -- Big boi function.
export const handleButton = async(
  veluna: Veluna,
  interaction: ButtonInteraction,
): Promise<void> => {
  const { customId, message } = interaction;

  if (customId === "ask") {
    await interaction.showModal(ask);
  }

  if (customId === "answer") {
    await interaction.showModal(answer);
  }

  if (customId.startsWith("block-")) {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });
    if (!interaction.inCachedGuild()) {
      await interaction.editReply({
        content: "This interaction can only be used in a server.",
      });
      return;
    }
    const { member, guild } = interaction;
    if (!member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      await interaction.editReply({
        content: "You do not have permission to use this interaction.",
      });
      return;
    }

    const userId = customId.replace("block-", "");
    const record = await veluna.db.servers.findUnique({
      where: {
        serverId: guild.id,
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

    if (record.blockedUsers.includes(userId)) {
      await interaction.editReply({
        content: "This user is already blocked.",
      });
      await message.delete();
      return;
    }

    await veluna.db.servers.update({
      data: {
        blockedUsers: {
          push: userId,
        },
      },
      where: {
        serverId: guild.id,
      },
    });
    await interaction.editReply({
      content: "User blocked successfully.",
    });
    await message.delete();
  }
};
