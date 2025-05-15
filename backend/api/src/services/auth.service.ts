import { StatusCodes } from "http-status-codes";
import HTTPException from "../exceptions/http.exception";
import { IUser } from "../interfaces/user.interface";
import UserModel from "../models/user.model";
import { isEmpty } from "../utils/util";
import {
	IUserSignupDataType,
	IUserLoginDataType,
} from "../schemas/auth.validation.schema";
import { TokenDataType } from "../interfaces/auth.interface";

class AuthService {
	private authModel = UserModel;

	public signup = async (userData: IUserSignupDataType): Promise<IUser> => {
		if (isEmpty(userData))
			throw new HTTPException(StatusCodes.BAD_REQUEST, "Empty user data");
		const { password, passwordRepeat, email } = userData;

		const existingUser = await this.authModel.findOne({ email });
		if (existingUser)
			throw new HTTPException(
				StatusCodes.BAD_REQUEST,
				"Email already registered"
			);

		if (password !== passwordRepeat)
			throw new HTTPException(StatusCodes.BAD_REQUEST, "Passwords dont match");

		const user = await this.authModel.create(userData);

		return user;
	};

	public login = async (
		loginData: IUserLoginDataType
	): Promise<{ user: IUser; token: TokenDataType; cookie: string }> => {
		if (isEmpty(loginData))
			throw new HTTPException(StatusCodes.BAD_REQUEST, "Empty login data");

		const user = await this.authModel.findOne({ email: loginData.email });
		if (!user) {
			throw new HTTPException(StatusCodes.NOT_FOUND, "Email not registered");
		}

		const isMatch = await user.comparePassword(loginData.password);
		if (!isMatch) {
			throw new HTTPException(
				StatusCodes.BAD_REQUEST,
				"Wrong login credentials"
			);
		}
		const tokenData = user.getJWTToken();
		const cookie = this.createCookie(tokenData);
		return { user, cookie, token: tokenData };
	};

	public logout = async (userId: string): Promise<IUser> => {
		if (isEmpty(userId))
			throw new HTTPException(StatusCodes.BAD_REQUEST, "Empty user Id");
		const user = await this.authModel.findById(userId);
		if (!user) {
			throw new HTTPException(StatusCodes.NOT_FOUND, "User not found");
		}

		return user;
	};

	public createCookie(tokenData: TokenDataType): string {
		return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
	}
}

export default AuthService;
