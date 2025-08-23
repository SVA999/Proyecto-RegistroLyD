const express = require('express');
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { validateLogin, validateRegister } = require('../middleware/validation.middleware');
const { loginLimiter, registerLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/login', loginLimiter, validateLogin, authController.login);
router.post('/register', registerLimiter, validateRegister, authController.register);
router.post('/logout', authController.logout);
router.get('/me', authenticateToken, authController.me);

module.exports = router;