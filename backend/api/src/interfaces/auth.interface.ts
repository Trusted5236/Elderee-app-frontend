import { Request } from "express";
import { IUser } from "./user.interface";

// export interface SignUpDataType {
// 	email: string;
// 	password: string;
// 	firstName: string;
// 	lastName: string;
// 	passwordRepeat: string;
// }

export interface loginDataType {
	email: string;
	password: string;
}

export interface RequestWithUser extends Request {
	user: IUser;
}

export interface DataStoreInJWT {
	_id: string;
}

export interface TokenDataType {
	token: string;
	expiresIn: number;
}

export interface IUserMethodsTypes {
	comparePassword: (password: string) => Promise<boolean>;
	getJWTToken: () => TokenDataType;
}
