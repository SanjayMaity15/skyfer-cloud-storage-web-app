import { connect } from "mongoose";

export const connectDatabase = async () => {
	try {
		await connect(process.env.MONGO_URI);
		console.log("!!! DB CONNECTED SUCCESSFULLY !!!");
	} catch (error) {
        console.error("DB CONNECTION FAILED", error);
        process.exit(1)
	}
};
