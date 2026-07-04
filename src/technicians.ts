import { WASocket } from 'baileys';

import { config } from './config.js';

function toWhatsappJid(phoneNumber: string) {
    const value = phoneNumber.trim();

    if (value.includes('@')) {
        return value.replace('@c.us', '@s.whatsapp.net').replace('@c.br', '@s.whatsapp.net');
    }

    const onlyDigits = value.replace(/\D/g, '');
    if (!onlyDigits) return null;

    return `${onlyDigits}@s.whatsapp.net`;
}

function getWhatsappLink(jid: string) {
    const number = jid.split('@')[0]?.replace(/\D/g, '');
    return number ? `https://wa.me/${number}` : jid;
}

export async function notifyTechnicians(sock: WASocket, customerJid: string) {
    if (!sock.user?.id) {
        console.warn('Bot ainda não está conectado; não foi possível notificar técnicos.');
        return 0;
    }

    const technicianJids = config.technicians
        .map(toWhatsappJid)
        .filter((jid): jid is string => Boolean(jid));

    if (!technicianJids.length) {
        console.warn('Nenhum número de técnico configurado para receber a notificação.');
        return 0;
    }

    console.log('Notificando técnicos:', technicianJids);

    const customerLink = getWhatsappLink(customerJid);
    const text =
        '*Novo chamado para atendimento tecnico*\n\n' +
        `Cliente: ${customerJid}\n` +
        `Abrir conversa: ${customerLink}\n\n` +
        'O cliente pediu para falar com um atendente.';

    let sentCount = 0;

    for (const technicianJid of technicianJids) {
        try {
            await sock.sendMessage(technicianJid, { text });
            sentCount += 1;
            console.log(`Mensagem enviada para: ${technicianJid}`);
        } catch (err) {
            console.error(`Falha ao enviar mensagem para ${technicianJid}:`, err);
        }
    }

    return sentCount;
}
