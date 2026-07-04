import makeWASocket, { DisconnectReason, useMultiFileAuthState } from 'baileys';
import qrcode from 'qrcode-terminal';
import pino from 'pino';
import { rm } from 'node:fs/promises';

import { config } from './config.js';
import { commands } from './commands/index.js';
import { getMenuOption, sendMainMenu } from './mainMenu.js';

const sessionDir = 'session';
const greetedContacts = new Set<string>();

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: 'warn' }),
        markOnlineOnConnect: true,
    });

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (connection) {
            console.log(`Conexao: ${connection}`);
        }

        if (qr) {
            console.log('Escaneie o QR Code:\n');
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'open') {
            console.log('Bot conectado com sucesso!');
        }

        if (connection === 'close') {
            const statusCode = (lastDisconnect?.error as any)?.output?.statusCode;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
            console.error('Erro de desconexao:', lastDisconnect?.error);
            console.log(`Codigo: ${statusCode ?? 'desconhecido'}`);

            if (statusCode === DisconnectReason.loggedOut) {
                console.log('Sessao desconectada. Limpando credenciais para gerar um novo QR Code...');
                await rm(sessionDir, { recursive: true, force: true });
                startBot();
                return;
            }

            console.log(`Conexao fechada. Reconectar: ${shouldReconnect}`);
            if (shouldReconnect) startBot();
        }
    });

    sock.ev.on('creds.update', saveCreds);

    // Resposta automatica + comandos
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const from = msg.key.remoteJid!;
        const text =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text ||
            msg.message.imageMessage?.caption ||
            msg.message.videoMessage?.caption ||
            msg.message.buttonsResponseMessage?.selectedButtonId ||
            msg.message.listResponseMessage?.singleSelectReply?.selectedRowId ||
            '';

        if (text.startsWith(config.prefix)) {
            const args = text.slice(config.prefix.length).trim().split(/ +/);
            const command = args.shift()?.toLowerCase();

            if (command && commands[command]) {
                try {
                    await commands[command](sock, msg, args);
                } catch (err) {
                    console.error(err);
                }
            }

            return;
        }

        const selectedOption = getMenuOption(text);
        if (selectedOption === 'products') {
            await sock.sendMessage(from, {
                text: 'Perfeito! Me diga qual produto voce procura ou envie uma foto/referencia.',
            });
            return;
        }

        if (selectedOption === 'attendant') {
            await sock.sendMessage(from, {
                text: 'Certo, vou chamar um atendente para continuar seu atendimento.',
            });
            return;
        }

        if (selectedOption === 'owner') {
            await commands.owner(sock, msg, []);
            return;
        }

        if (greetedContacts.has(from)) {
            return;
        }

        greetedContacts.add(from);

        // Saudacao automatica
        await sendMainMenu(sock, from);
    });
}

startBot().catch(console.error);
