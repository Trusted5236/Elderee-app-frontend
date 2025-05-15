import "dotenv/config";
//config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const { PORT, JWT_LIFETIME, JWT_SECRET, NODE_ENV, ORIGIN, CREDENTIALS } =
	process.env;

export const MONGO_URI =
	process.env.NODE_ENV === "production"
		? process.env.MONGO_URI
		: "mongodb://127.0.0.1:27017/quiz-api";
