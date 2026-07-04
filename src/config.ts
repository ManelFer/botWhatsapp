import dotenv from 'dotenv';
dotenv.config();

export const config = {
    prefix: process.env.PREFIX || '!',
    owner: process.env.OWNER_NUMBER || '',
    technicians: (process.env.TECHNICIAN_NUMBERS || '')
        .split(',')
        .map((number) => number.trim())
        .filter(Boolean),
};
