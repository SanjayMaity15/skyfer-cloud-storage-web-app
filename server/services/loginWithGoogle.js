import dotenv from "dotenv"
import { OAuth2Client } from "google-auth-library";

dotenv.config()

// creating client
const client = new OAuth2Client({
	client_id: process.env.GOOGLE_CLIENT_ID,
	client_secret: process.env.GOOGLE_CLIENT_SECRET,
	redirectUri: process.env.GOOGLE_REDIRECT_URI,
});

