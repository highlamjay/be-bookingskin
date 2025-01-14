const express = require('express');
const router = express.Router();

const {
    registerUser, 
    loginUser, 
    changePasswordUser, 
    fetchDetailUser, 
    fetchAllUser,
    uploadAvatarUser,
    logoutUser
} = require('../controllers/auth-controller')

const {sendCode} = require('../controllers/verification-controller');
const authMiddleware = require('../middlewares/auth-middleware');
const adminMiddleware = require('../middlewares/admin-middleware')
const uploadMiddleware = require('../middlewares/upload-middleware');

router.post('/register', registerUser, sendCode)
router.post('/login', loginUser)
router.post('/change-password/:id', authMiddleware, changePasswordUser)
router.get('/fetch-detail/:id', authMiddleware, fetchDetailUser)
router.get('/fetch-all', authMiddleware, adminMiddleware, fetchAllUser)
router.put('/upload-image', authMiddleware, uploadMiddleware.single('image'), uploadAvatarUser)
router.post('/log-out', authMiddleware, logoutUser)

module.exports = router;