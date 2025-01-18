
const isAdminUser = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized! No token provided.",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Giải mã token
        if (decoded.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied! Admin rights required.",
            });
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error ! Please try again !'
        })
    }
}

module.exports = isAdminUser