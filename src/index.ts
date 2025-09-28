/**
 * @copyright NHCarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */

import { PrismaClient } from "@prisma/client";
import { Client, GatewayIntentBits, Events } from "discord.js";
import { handleButton } from "./modules/handleButton.js";
import { handleChatCommand } from "./modules/handleChatCommand.js";
import { handleModalSubmit } from "./modules/handleModalSubmit.js";
import { instantiateServer } from "./server/serve.js";
import { logger } from "./utils/logger.js";
import type { Veluna } from "./interfaces/veluna.js";

const veluna: Veluna = {
  db:      new PrismaClient(),
  discord: new Client({
    intents: [ GatewayIntentBits.Guilds ],
  }),
};

veluna.discord.once(Events.ClientReady, () => {
  void logger.log(
    "debug",
    `Client authenticated as ${veluna.discord.user?.username ?? "unknown user"}`,
  );
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises -- Top-level await.
veluna.discord.on(Events.InteractionCreate, async(interaction) => {
  if (!interaction.inCachedGuild()) {
    return;
  }
  if (interaction.isButton()) {
    await handleButton(veluna, interaction);
    return;
  }
  if (interaction.isModalSubmit()) {
    await handleModalSubmit(veluna, interaction);
    return;
  }
  if (interaction.isChatInputCommand()) {
    await handleChatCommand(veluna, interaction);
  }
});

await veluna.discord.login(process.env.BOT_TOKEN);
instantiateServer();
