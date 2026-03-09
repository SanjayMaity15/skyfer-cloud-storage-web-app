// get all users

import Session from "../models/Session.js"
import User from "../models/User.js"

export const getAllUser = async (req, res) => {
    try {
        const allUsers = await User.find({ role: "user" })
        const session = await Session.find({})

        console.log(allUsers)
        console.log(session)

        const users = allUsers.map((user) => {

            const isLoggedIn = session.some((session) => session.userId.toString() === user._id.toString())

            return {
                name: user.userName,
                email: user.email,
                join: user.createdAt,
                gender: user.gender,
                isLoggedIn,
            }
        })
            

        console.log(users)

        return res.status(200).json({
            success: true,
            data: users
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}