import { success } from "zod";
import { editProfileSchema } from "../validators/authValidators.js"



/*
=========================================

		Edit user profile Controller

=========================================
*/


export const editProfile = async (req, res) => {
    try {
        const { success, data } = editProfileSchema.safeParse(req.body)
        
        if (!success) {
            return res.status(400).json({
                success: false,
                message: "All fields must be filled"
            })
        }

        const { userName, gender } = data;

        const user = req.user;
        user.userName = userName;
        user.gender = gender;

        await user.save()

        return res.status(200).json({
            success: true,
            message : "Profile updated successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}