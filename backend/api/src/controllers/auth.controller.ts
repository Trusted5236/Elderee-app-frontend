import { StatusCodes } from "http-status-codes";
import AuthService from "../services/auth.service";
import { Request, Response, NextFunction } from "express";
import { RequestWithUser } from "../interfaces/auth.interface";

class AuthController {
	private authService = new AuthService();

	public signup = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const user = await this.authService.signup(req.body);
			res
				.status(StatusCodes.CREATED)
				.json({ data: user, message: "User registered" });
		} catch (error) {
			next(error);
		}
	};

	public login = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { token, cookie, user } = await this.authService.login(req.body);
			res.setHeader("Set-Cookie", [cookie]);
			res
				.status(StatusCodes.CREATED)
				.json({ data: { token, user }, message: "User logged in" });
		} catch (error) {
			next(error);
		}
	};

	public logOut = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const user = await this.authService.logout(
				(req as RequestWithUser).user._id
			);
			res.setHeader("Set-Cookie", ["Authorization=; Max-age=0"]);
			res
				.status(StatusCodes.OK)
				.json({ message: "User logged out", data: user });
		} catch (error) {
			next(error);
		}
	};
}

export default AuthController;
