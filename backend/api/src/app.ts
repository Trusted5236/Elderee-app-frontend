import { CREDENTIALS, MONGO_URI, PORT } from "./config";
import express, { Application } from "express";
import { Routes } from "./interfaces/route.interface";
import errorMiddleware from "./middlewares/error.middleware";
import { notFoundError } from "./middlewares/notfound.middleware";
import connectDB from "./database/connect";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";

class App {
	public port: number;
	public app: Application;
	private mongoDBUri: string;

	constructor(routes: Routes[]) {
		this.port = (PORT || 8500) as number;
		this.app = express();
		this.mongoDBUri = MONGO_URI!;

		this.connectDatabase();
		this.initializeMiddlewares();
		this.initializeRoutes(routes);
		this.initializeErrorHandling();
	}

	private initializeMiddlewares = () => {
		this.app.use(morgan("combined"));
		this.app.use(express.json());
		this.app.use(helmet());
		this.app.use(cors({ origin: CREDENTIALS, credentials: true }));
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(cookieParser());
	};

	private initializeRoutes = (routes: Routes[]) => {
		routes.forEach(({ router }) => {
			this.app.use("/", router);
		});
	};

	private connectDatabase = async () => {
		try {
			await connectDB(this.mongoDBUri);
			console.log("Connected to database");
		} catch (error) {
			console.error("Failed to connect to database");
		}
	};

	private initializeErrorHandling = () => {
		this.app.use(errorMiddleware);
		this.app.use(notFoundError);
	};

	public startServer = async () => {
		this.app.listen(this.port, (error) => {
			if (error) {
				console.log(`Failed to start server on port ${this.port}`);
			}
			console.log(`Server listening on port ${this.port}`);
		});
	};
}

export default App;
