import dotenv from 'dotenv';
dotenv.config();

export const SECRET: string | undefined = process.env.JWT_SECRET;
export const PORT: number = Number(process.env.PORT) || 3000;