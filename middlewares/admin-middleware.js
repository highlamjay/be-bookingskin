
const isAdminUser = (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ 
                success: true,
                message: 'Access denied ! Admin rights required' 
            })  
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