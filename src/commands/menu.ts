import { CommandHandler } from './types.js';
import { sendMainMenu } from '../mainMenu.js';

export const menu: CommandHandler = async (sock, msg) => {
    const from = msg.key?.remoteJid;
    if (!from) return;

    await sendMainMenu(sock, from);
};
