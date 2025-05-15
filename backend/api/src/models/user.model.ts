import { Model, Schema, model } from "mongoose";
import { IUser } from "../interfaces/user.interface";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { JWT_LIFETIME as number, JWT_SECRET } from "../config";
import { IUserMethodsTypes, TokenDataType } from "../interfaces/auth.interface";

type UserModelType = Model<IUser, {}, IUserMethodsTypes>;

const userSchema: Schema<IUser, UserModelType, IUserMethodsTypes> = new Schema({
	email: {
		type: String,
		required: [true, "Email is required"],
		trim: true,
	},
	password: {
		type: String,
		maxlength: [16, "Password is atmost 16 characters"],
		minlength: [8, "Password is 8 atleast 8 characters"],
		trim: true,
		required: [true, "Password is required"],
	},
	firstName: {
		type: String,
		required: [true, "First name is required"],
		trim: true,
	},
	lastName: {
		type: String,
		required: [true, "Last name is required"],
		trim: true,
	},
	role: {
		type: String,
		default: "user",
		required: false,
	},
	verificationTokenExpiresBy: {
		type: Number,
		default: 0,
		required: false,
	},
	varificationToken: {
		type: String,
		default: "",
		required: false,
	},
	varified: {
		type: Boolean,
		default: false,
		required: false,
	},
});

userSchema.pre("save", async function (next) {
	if (!this.password) return;
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

userSchema.methods.getJWTToken = function (): TokenDataType {
	const expiresIn = 60 * 60 * 2;
	const token = jwt.sign({ _id: this._id }, JWT_SECRET!, {
		expiresIn, // two hours
	});
	return { token, expiresIn };
};

userSchema.methods.comparePassword = async function (
	password: string
): Promise<boolean> {
	const isMatch = await bcrypt.compare(password, this.password);
	return isMatch;
};

const UserModel = model<IUser, UserModelType>("User", userSchema);

export default UserModel;
