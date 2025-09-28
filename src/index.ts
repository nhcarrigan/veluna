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

veluna.discord.on(Events.InteractionCreate, (interaction) => {
  if (!interaction.inCachedGuild()) {
    return;
  }
  if (interaction.isButton()) {
    void handleButton(veluna, interaction);
  }
  if (interaction.isModalSubmit()) {
    void handleModalSubmit(veluna, interaction);
  }
  if (interaction.isChatInputCommand()) {
    void handleChatCommand(veluna, interaction);
  }
});

await veluna.discord.login(process.env.BOT_TOKEN);
instantiateServer();
