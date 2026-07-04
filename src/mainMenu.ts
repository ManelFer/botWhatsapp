import { WASocket } from 'baileys';

export const menuOptions = {
    products: ['1', 'produtos', 'produto', 'catalogo', 'catálogo'],
    attendant: ['2', 'atendente', 'humano', 'vendedor'],
    owner: ['3', 'dono', 'owner', 'contato'],
};

export async function sendMainMenu(sock: WASocket, to: string) {
    await sock.sendMessage(to, {
        text:
            '*Ola! Sou o vendedor X.*\n\n' +
            'Como posso te ajudar?\n\n' +
            '*1* - Ver produtos\n' +
            '*2* - Falar com atendente\n' +
            '*3* - Contato do dono\n\n' +
            'Qual opção você deseja?',
    });
}

export function getMenuOption(text: string) {
    const normalized = text.trim().toLowerCase();

    if (menuOptions.products.includes(normalized)) return 'products';
    if (menuOptions.attendant.includes(normalized)) return 'attendant';
    if (menuOptions.owner.includes(normalized)) return 'owner';

    return null;
}
