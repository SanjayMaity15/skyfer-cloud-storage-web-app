// redirect to popup

import mongoose from "mongoose";
import User from "../models/User.js";
import {
	generateGoogleAuthURL,
	getUserInfoUsingGoogleLogin,
} from "../services/loginWithGoogle.js";
import Directory from "../models/Directory.js";
import Session from "../models/Session.js";
import { addPasswordSchema, resetPasswordSchema } from "../validators/passResetValidators.js";



/*
=========================================

	Redirect to google longin popup Controller

=========================================
*/

export const redirectToPopupScreen = async (req, res) => {
	try {
		const authURL = generateGoogleAuthURL();
		res.redirect(authURL);
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};



/*
=========================================

	Fetch user from google auth code Controller

=========================================
*/

export const fetchUser = async (req, res) => {
	try {
		const mongooseSession = await mongoose.startSession();

		const { code } = req.query;
		if (!code) return res.status(400).send("No code provided");

		const userData = await getUserInfoUsingGoogleLogin(code);
		console.log(userData);

		const { email, name } = userData;

		let user = await User.findOne({ email });

		if (!user) {
			const userId = new mongoose.Types.ObjectId();
			const dirId = new mongoose.Types.ObjectId();

			// here start transaction
			mongooseSession.startTransaction();

			user = new User({
				_id: userId,
				userName: name,
				email,
				rootDirId: dirId,
			});

			const newDirectory = new Directory({
				_id: dirId,
				dirName: `root-${email}`,
				owner: userId,
			});

			await user.save({ session: mongooseSession });
			await newDirectory.save({ session: mongooseSession });
			// save all changes permanently
			await mongooseSession.commitTransaction();
			mongooseSession.endSession();
		}

		const existingSession = await Session.findOne({ userId: user._id });
		if (existingSession) {
			await existingSession.deleteOne();
		}

		const session = await Session.create({ userId: user._id });

		// send user details to frontend
		const userDetails = {
			_id: user._id,
			userName: user.userName,
			email: user.email,
			profilePic: user.profilePic,
			role: user.role,
			rootDirId: user.rootDirId,
		};

		const payload = session._id.toString();
		res.cookie("SID", payload, {
			httpOnly: true,
			maxAge: 30 * 24 * 60 * 60 * 1000,
		});

		// TODO: create user / session / JWT here

		// send user data to opener and close popup
		return res.send(`
			<script>
				try {
				if (window.opener) {
					window.opener.postMessage(
					{ type: "GOOGLE_AUTH_SUCCESS", data: ${JSON.stringify(userDetails)} },
					"http://localhost:5173" 
					);
				}
				} catch (e) {}	

				setTimeout(() => window.close(), 100);
			</script>
    `);
	} catch (error) {
		console.error("Google Auth Error:", error);
		return res.send(`
      <script>
        alert("Authentication failed");
        window.close();
      </script>
    `);
	}
};




/*
=========================================

	Add password for google login user Controller

=========================================
*/

export const addPasswordForGoogleLoginUser = async (req, res) => {
	try {

		console.log(req.body);

		const { success, data } = addPasswordSchema.safeParse(req.body);

		if (!success) {
			return res.status(400).json({
				success: false,
				message: "All field must be filled",
			});
		}

		const { newPass: password } = data;

		const user = req.user;
		user.password = password;
		await user.save()

		return res.status(201).json({
			success: true,
			message: "Password saved successfully"
		})

	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Server error"
		})
	}
};
