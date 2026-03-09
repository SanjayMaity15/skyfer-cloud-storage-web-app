export const isAdmin = async (req, res, next) => {
    if (!req.user.role === "admin") {
        return res.status(401).json({
            success: false,
            message: "Not authorized"
        })
    }

    next()
}