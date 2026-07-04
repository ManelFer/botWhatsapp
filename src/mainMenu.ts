import { WASocket } from 'baileys';

import { menuOptions, type MenuOptionKey } from './menuOptions.js';

export async function sendMainMenu(sock: WASocket, to: string) {
    await sock.sendMessage(to, {
        text:
            '*Ola!.*\n\n' +
            'Como posso te ajudar?\n\n' +
            '*1* - Quero ajuda com o Solar\n' +
            '*2* - Falar com técnico\n\n' 
    });
}

export function getMenuOption(text: string): MenuOptionKey | null {
    const normalized = text.trim().toLowerCase();

    for (const [option, aliases] of Object.entries(menuOptions) as [MenuOptionKey, string[]][]) {
        if (aliases.includes(normalized)) return option;
    }

    return null;
}
