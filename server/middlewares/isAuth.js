import Session from "../models/Session.js";
import User from "../models/User.js";

export const isAuth = async (req, res, next) => {
	const { SID } = req.cookies;

	if (!SID) {
		return res.status(401).json({
			success: false,
			message: "Unauthorized please login",
		});
	}

	try {
		const session = await Session.findById(SID);

		if (!session) {
			res.clearCookie("SID");
			return res.status(401).json({
				success: false,
				message: "Not Authorized please login",
			});
		}

		const user = await User.findById(session.userId).select("-password");

		req.user = user;

		next();
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Something went wrong",
		});
	}
};
