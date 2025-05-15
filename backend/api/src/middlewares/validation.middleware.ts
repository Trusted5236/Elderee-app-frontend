import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";
import HTTPException from "../exceptions/http.exception";
import { StatusCodes } from "http-status-codes";

/*
This validation middleware uses validation schema to validate data in body params and query accordingly
*/

const validationMiddleware = (
	schema: z.ZodTypeAny,
	source: "body" | "params" | "query"
) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			await schema.parseAsync(req[source]);
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				const message = error.errors.map((issue: any) => ({
					message: `${issue.path.join(".")}: ${issue.message}`,
				}));
				res.status(StatusCodes.BAD_REQUEST).json({ details: message });
			} else {
				throw new HTTPException(
					StatusCodes.INTERNAL_SERVER_ERROR,
					"Something went wrong"
				);
			}
		}
	};
};

export default validationMiddleware;
