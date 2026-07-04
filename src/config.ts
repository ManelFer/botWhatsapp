import dotenv from 'dotenv';
dotenv.config();

export const config = {
    prefix: process.env.PREFIX || '!',
    owner: process.env.OWNER_NUMBER || '',
};