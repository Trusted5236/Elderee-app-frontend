import { NextFunction, Response, Request } from "express";
import { verify } from "jsonwebtoken";

import UserModel from "../models/user.model";
import { JWT_SECRET } from "../config";
import { DataStoreInJWT, RequestWithUser } from "../interfaces/auth.interface";
import HTTPException from "../exceptions/http.exception";
import { StatusCodes } from "http-status-codes";

const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const Authorization =
			req.cookies["Authorization"] ||
			(req.headers.authorization
				? req.headers.authorization.split("Bearer ")[1]
				: null);

		if (Authorization) {
			const secretKey: string = JWT_SECRET!;
			const verificationResponse = (await verify(
				Authorization,
				secretKey
			)) as DataStoreInJWT;
			const userId = verificationResponse._id;
			const findUser = await UserModel.findById(userId);

			if (findUser) {
				(req as RequestWithUser).user = findUser;
				next();
			} else {
				next(
					new HTTPException(
						StatusCodes.UNAUTHORIZED,
						"Wrong authentication token"
					)
				);
			}
		} else {
			next(
				new HTTPException(
					StatusCodes.BAD_REQUEST,
					"Authentication token missing"
				)
			);
		}
	} catch (error) {
		next(
			new HTTPException(StatusCodes.UNAUTHORIZED, "Wrong authentication token")
		);
	}
};

export default authMiddleware;
