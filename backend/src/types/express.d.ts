import type { JwtPayload } from 'jsonwebtoken';
import type { Board, BoardColumn, Project, ProjectMember, User } from '../generated/prisma/client.ts';

declare global {
	namespace Express {
		interface Request {
			user: User;
			decodedToken: JwtPayload;
			project?: Project & {
				members: ProjectMember[];
			};
			projectMember?: ProjectMember;
			board?: Board;
			boardColumn?: BoardColumn;
		}
	}
}

export { };