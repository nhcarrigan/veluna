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
    setLabel("What do you want to ask?").
    setStyle(TextInputStyle.Paragraph).
    setMaxLength(1000).
    setMinLength(1).
    setRequired(true),
);

export const ask = new ModalBuilder().
  setCustomId("ask").
  setTitle("Ask a Question!").
  addComponents(row);
