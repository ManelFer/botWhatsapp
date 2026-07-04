import { WASocket, proto } from 'baileys';

export type CommandHandler = (
    sock: WASocket,
    msg: proto.IWebMessageInfo,
    args: string[]
) => Promise<void>;
