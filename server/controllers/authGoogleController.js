// redirect to popup

import {
	generateGoogleAuthURL,
	getUserInfoUsingGoogleLogin,
} from "../services/loginWithGoogle.js";

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
export const fetchUser = async (req, res) => {
	try {
		const { code } = req.query;
		if (!code) return res.status(400).send("No code provided");

		const userData = await getUserInfoUsingGoogleLogin(code);
		console.log(userData);

		// TODO: create user / session / JWT here

		// send user data to opener and close popup
		return res.send(`
			<script>
				try {
				if (window.opener) {
					window.opener.postMessage(
					{ type: "GOOGLE_AUTH_SUCCESS", data: ${JSON.stringify(userData)} },
					"http://localhost:5173" // your frontend origin
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