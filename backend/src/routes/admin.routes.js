const express = require('express');
const adminController = require('../controllers/admin.controller');
const { authenticateToken, requireAdmin } = require('../middleware/auth.middleware');
const { validateAdminRecords, handleValidationErrors } = require('../middleware/validation.middleware');
const { param, body } = require('express-validator');

const router = express.Router();

// Todas las rutas requieren autenticación y permisos de admin
router.use(authenticateToken);
router.use(requireAdmin);

// Rutas de registros
router.get('/records', validateAdminRecords, adminController.getAllRecords);
router.get('/records/export', validateAdminRecords, adminController.exportRecords);

// Estadísticas del dashboard
router.get('/stats', adminController.getDashboardStats);

// Gestión de usuarios
router.get('/users', adminController.getAllUsers);
router.patch('/users/:id/status', [
  param('id').isInt({ min: 1 }).withMessage('ID de usuario válido es requerido'),
  body('active').isBoolean().withMessage('Estado activo debe ser true o false'),
  handleValidationErrors
], adminController.toggleUserStatus);

module.exports = router;