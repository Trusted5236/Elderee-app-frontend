import { NextFunction, Request, Response } from "express";
import HTTPException from "../exceptions/http.exception";
import { StatusCodes } from "http-status-codes";

const errorMiddleware = async (
	error: HTTPException,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const status: number = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
		const message: string = error.message || "Something went wrong";
		res.status(status).json({ message });
	} catch (error) {
		next(error);
	}
};

export default errorMiddleware;
