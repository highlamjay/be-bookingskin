
const isAdminUser = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ 
            success: true,
            message: 'Access denied ! Admin rights required' 
        })
        next();
    } else {
        res.status(401).json({
            success: false,
            message: 'Unauthorized' 
        })
    }
}

module.exports = isAdminUser