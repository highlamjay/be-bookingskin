const express = require('express');
const router = express.Router();

const {registerUser, loginUser} = require('../controllers/auth-controller')
const {sendCode} = require('../controllers/verification-controller')

router.post('/register', registerUser, sendCode)
router.post('/login', loginUser)


module.exports = router;