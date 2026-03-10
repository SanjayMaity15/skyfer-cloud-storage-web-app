import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";

dotenv.config();

// creating client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const getUserInfoUsingGoogleLogin = async (idToken) => {
	// get user deatils

	const loginTicket = await client.verifyIdToken({
		idToken,
		audience: process.env.GOOGLE_CLIENT_ID,
	});

	// collect payload from loginTicket
	return loginTicket.getPayload();
};
