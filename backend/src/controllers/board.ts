import { Router, type Request, type Response } from "express";
import { ApiError, boardExtractor, requireBoardProjectAdminRole, requireBoardProjectMember, tokenExtractor, userExtractor } from "../utils/middleware.js";
import { prisma } from "../prisma.js";

const boardRouter = Router();

boardRouter.get("/:id",
	tokenExtractor,
	userExtractor,
	boardExtractor,
	requireBoardProjectMember,
	async (request: Request, response: Response) => {
		const board = request.board!;

		return response.status(200).json(board);
	}
);

boardRouter.put("/:id",
	tokenExtractor,
	userExtractor,
	boardExtractor,
	requireBoardProjectMember,
	requireBoardProjectAdminRole,
	async (request: Request, response: Response) => {
		const board = request.board!;
		const { name } = request.body;

		if (!name) throw new ApiError(400, "BOARD_NAME_REQUIRED", "Board name is required.");
		if (typeof name !== "string") throw new ApiError(400, "BOARD_NAME_INVALID", "Board name must be a string.");
		if (name.trim() === "") throw new ApiError(400, "BOARD_NAME_REQUIRED", "Board name is required.");

		const boardExists = await prisma.board.findUnique({ where: { projectId_name: { projectId: board.projectId, name } } });
		if (boardExists) throw new ApiError(409, "BOARD_EXISTS", "A board with this name already exists in the project.");

		const updatedBoard = await prisma.board.update({ where: { id: board.id }, data: { name } });

		return response.status(200).json(updatedBoard);
	}
);

boardRouter.delete("/:id",
	tokenExtractor,
	userExtractor,
	boardExtractor,
	requireBoardProjectMember,
	requireBoardProjectAdminRole,
	async (request: Request, response: Response) => {
		const board = request.board!;

		await prisma.board.delete({ where: { id: board.id } });

		return response.status(204).send();
	}
);


export default boardRouter;