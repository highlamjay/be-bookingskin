const express = require('express');
const router = express.Router();

const {verifyEmail, sendCodeAgain} = require('../controllers/verification-controller')

router.post('/verify-code', verifyEmail)
router.get('/send-again', sendCodeAgain)


module.exports = router;