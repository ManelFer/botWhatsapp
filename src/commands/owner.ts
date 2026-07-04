import { CommandHandler } from './types.js';
import { config } from '../config.js';

export const owner: CommandHandler = async (sock, msg) => {
    const from = msg.key?.remoteJid;
    if (!from) return;

    await sock.sendMessage(from, {
        text: `*Dono do Bot*\nNumero: ${config.owner || 'nao configurado'}`
    });
};
