import { Router } from "express";
import { Routes } from "../interfaces/route.interface";
import AuthController from "../controllers/auth.controller";
import validationMiddleware from "../middlewares/validation.middleware";
import {
	userLoginValidationSchema,
	userSignupValidationSchema,
} from "../schemas/auth.validation.schema";
import authMiddleware from "../middlewares/auth.middleware";

class AuthRoute implements Routes {
	public path = "/auth";
	public router = Router();
	private authController = new AuthController();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.post(
			`${this.path}/signup`,
			validationMiddleware(userSignupValidationSchema, "body"),
			this.authController.signup
		);
		this.router.post(
			`${this.path}/login`,
			validationMiddleware(userLoginValidationSchema, "body"),
			this.authController.login
		);
		this.router.post(
			`${this.path}/logout`,
			authMiddleware,
			this.authController.logOut
		);
	}
}

export default AuthRoute;
