import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";

dotenv.config();

// creating client
const client = new OAuth2Client(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	process.env.GOOGLE_REDIRECT_URI,
);

export const generateGoogleAuthURL = () => {
	return client.generateAuthUrl({
		scope: ["openid", "email", "profile"],
	});
};

export const getUserInfoUsingGoogleLogin = async (code) => {
	// code exchange for user id_token
	const {
		tokens: { id_token },
	} = await client.getToken(code);

	// get user deatils

	const loginTicket = await client.verifyIdToken({
		idToken: id_token,
		audience: process.env.GOOGLE_CLIENT_ID
	});

	// collect payload from loginTicket
	return loginTicket.getPayload();

};
