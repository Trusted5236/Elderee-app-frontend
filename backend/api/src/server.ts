import App from "./app";
import AuthRoute from "./routes/auth.route";
import "dotenv/config";

const application = new App([new AuthRoute()]);

application.startServer();
