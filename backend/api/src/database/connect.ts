import { connect, set } from "mongoose";

const connectDB = async (uri: string) => {
	return connect(uri);
};

set("strictQuery", true);
export default connectDB;
