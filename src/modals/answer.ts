/**
 * @copyright NHCarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */

import {
  ModalBuilder,
  TextInputBuilder,
  ActionRowBuilder,
  TextInputStyle,
} from "discord.js";

const row = new ActionRowBuilder<TextInputBuilder>().addComponents(
  new TextInputBuilder().
    setCustomId("textinput").
    setLabel("What is your answer?").
    setStyle(TextInputStyle.Paragraph).
    setMaxLength(1000).
    setMinLength(1).
    setRequired(true),
);

export const answer = new ModalBuilder().
  setCustomId("answer").
  setTitle("Provide an Answer!").
  addComponents(row);
