import type { JwtPayload } from 'jsonwebtoken';
import type { User } from '../generated/prisma/client.ts';

declare global {
  namespace Express {
    interface Request {
      user: User;
	  decodedToken: JwtPayload;
    }
  }
}

export {};