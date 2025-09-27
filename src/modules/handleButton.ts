/**
 * @copyright NHCarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */

import { answer } from "../modals/answer.js";
import { ask } from "../modals/ask.js";
import type { ButtonInteraction } from "discord.js";

/**
 * Displays the appropriate modal when a button is pressed.
 * @param interaction - The button interaction payload from Discord.
 */
export const handleButton = async(
  interaction: ButtonInteraction,
): Promise<void> => {
  const { customId } = interaction;

  if (customId === "ask") {
    await interaction.showModal(ask);
  }

  if (customId === "answer") {
    await interaction.showModal(answer);
  }
};
