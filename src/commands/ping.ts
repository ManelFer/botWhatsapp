import { CommandHandler } from './types.js';

export const ping: CommandHandler = async (sock, msg) => {
    const start = Date.now();
    const from = msg.key?.remoteJid;
    if (!from) return;

    await sock.sendMessage(from, { text: 'Pong...' });
    const latency = Date.now() - start;
    await sock.sendMessage(from, { text: `*Pong!* \`${latency}ms\`` });
};
