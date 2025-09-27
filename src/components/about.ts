/**
 * @copyright NHCarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */

import {
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  ContainerBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} from "discord.js";

export const about = [
  new ContainerBuilder().
    addTextDisplayComponents(
      new TextDisplayBuilder().setContent("# About Veluna"),
    ).
    addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        // eslint-disable-next-line stylistic/max-len -- Big boi string.
        "Hi there~! I am Veluna, a bot that allows your community to ask you questions anonymously!",
      ),
    ).
    addSeparatorComponents(
      new SeparatorBuilder().
        setSpacing(SeparatorSpacingSize.Small).
        setDivider(true),
    ).
    addTextDisplayComponents(
      new TextDisplayBuilder().setContent("## What can I do?"),
    ).
    addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        // eslint-disable-next-line stylistic/max-len -- Big boi string.
        "To get started, a server admin must configure the channel where questions get posted (this should be a private channel to avoid moderation concerns) with `/questions` and the channel where answers get posted (this should be a public channel so the community can see responses) with `/answers`. Then, a server member can ask questions using the `/ask` command, and the admins can answer them!",
      ),
    ).
    addSeparatorComponents(
      new SeparatorBuilder().
        setSpacing(SeparatorSpacingSize.Small).
        setDivider(true),
    ).
    addTextDisplayComponents(
      new TextDisplayBuilder().setContent("## What if I need help?"),
    ).
    addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        // eslint-disable-next-line stylistic/max-len -- Big boi string.
        "My deepest apologies if I have made a mistake! Please reach out to us in our Discord server or on the forum, and we will do our best to assist you.",
      ),
    ),
  new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().
      setStyle(ButtonStyle.Link).
      setLabel("Discord Server").
      setURL("https://chat.nhcarrigan.com"),
  ),
];
