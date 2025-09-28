/**
 * @copyright NHCarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */

import {
  MessageFlags,
  PermissionFlagsBits,
  ChannelType,
  type ChatInputCommandInteraction,
} from "discord.js";
import { about } from "../components/about.js";
import { ask } from "../modals/ask.js";
import type { Veluna } from "../interfaces/veluna.js";

interface Query {
  questionChannelId?: string;
  answerChannelId?:   string;
}

const buildQuery = (type: string, id: string): Query => {
  if (type === "question") {
    return { questionChannelId: id };
  }
  if (type === "answer") {
    return { answerChannelId: id };
  }
  return {};
};

/**
 * Handles the logic for slash commands. Identifies the command name
 * and responds accordingly.
 * @param veluna - Veluna's instance.
 * @param interaction - The interaction payload from Discord.
 */
// eslint-disable-next-line max-lines-per-function -- Big boi function.
export const handleChatCommand = async(
  veluna: Veluna,
  interaction: ChatInputCommandInteraction<"cached">,
): Promise<void> => {
  const { commandName, options, guild, member } = interaction;

  if (commandName === "about") {
    await interaction.reply({
      components: about,
      flags:      [ MessageFlags.IsComponentsV2 ],
    });
    return;
  }

  if (commandName === "ask") {
    await interaction.showModal(ask);
    return;
  }

  // Permission gated commands w/ DB queries...

  await interaction.deferReply({
    flags: [ MessageFlags.Ephemeral ],
  });

  if (!member.permissions.has(PermissionFlagsBits.ManageGuild)) {
    await interaction.editReply({
      content: "You must be a server administrator to use this command.",
    });
    return;
  }

  // These both require a channel
  const channel = options.
    getChannel("channel", true, [ ChannelType.GuildText ]);

  const me = await guild.members.fetchMe().
    catch(() => {
      return null;
    });

  if (me?.permissions.has([
    PermissionFlagsBits.ViewChannel,
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.EmbedLinks,
  ]) !== true) {
    await interaction.editReply({
      content:
        // eslint-disable-next-line stylistic/max-len -- Big boi string.
        "I do not have permission to view and send messages in the channel provided. Please adjust my permissions and try again.",
    });
    return;
  }

  const query = buildQuery(commandName, channel.id);

  await veluna.db.servers.upsert({
    create: {
      answerChannelId:   query.answerChannelId ?? "",
      blockedUsers:      [],
      questionChannelId: query.questionChannelId ?? "",
      serverId:          guild.id,
    },
    update: buildQuery(commandName, channel.id),
    where:  {
      serverId: guild.id,
    },
  });

  await interaction.editReply({
    content: `This server's ${commandName} channel has been set to <#${channel.id}>.`,
  });
};
