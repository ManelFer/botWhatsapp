import { CommandHandler } from './types.js';
import { menu } from './menu.js';
import { ping } from './ping.js';
import { owner } from './owner.js';

export const commands: Record<string, CommandHandler> = {
    menu,
    ping,
    owner,
};
