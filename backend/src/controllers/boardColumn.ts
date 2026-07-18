import { Router, type Request, type Response } from "express";
import { tokenExtractor, userExtractor, columnExtractor, requireColumnMember, ApiError, requireColumnAdmin } from "../utils/middleware.js";
import { prisma } from "../prisma.js";

const boardColumnRouter = Router();

boardColumnRouter.get('/:id',
	tokenExtractor,
	userExtractor,
	columnExtractor,
	requireColumnMember,
	async (request: Request, response: Response) => {
		const boardColumn = request.boardColumn!;

		return boardColumn;
	}
);

boardColumnRouter.put('/:id',
	tokenExtractor,
	userExtractor,
	columnExtractor,
	requireColumnMember,
	requireColumnAdmin,
	async (request: Request, response: Response) => {
		const boardColumn = request.boardColumn!;
		const { name } = request.body;

		if (!name) throw new ApiError(400, "BOARD_COLUMN_NAME_REQUIRED", "Column name is required.");
		if (typeof name !== "string") throw new ApiError(400, "BOARD_COLUMN_NAME_INVALID", "Column name must be a string.");
		if (name.trim() === "") throw new ApiError(400, "BOARD_COLUMN_NAME_REQUIRED", "Column name is required.");

		const boardColumnExists = await prisma.boardColumn.findUnique({
			where: { boardId_name: { boardId: boardColumn.boardId, name } }
		});
		if (boardColumnExists) throw new ApiError(409, "BOARD_EXISTS", "A board with this name already exists in the project.");

		const updatedBoardColumn = await prisma.boardColumn.update({ where: { id: boardColumn.id }, data: { name } });

		return response.status(200).json(updatedBoardColumn);
	}
);

boardColumnRouter.delete('/:id',
	tokenExtractor,
	userExtractor,
	columnExtractor,
	requireColumnMember,
	requireColumnAdmin,
	async (request: Request, response: Response) => {
		const boardColumn = request.boardColumn!;

		await prisma.boardColumn.delete({ where: { id: boardColumn.id } });

		return response.status(204).send();
	}
);

export default boardColumnRouter;