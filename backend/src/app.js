const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const cleaningRoutes = require('./routes/cleaning.routes');
const adminRoutes = require('./routes/admin.routes');

const { globalErrorHandler } = require('./utils/errors');
const { generalLimiter } = require('./middleware/rateLimiter');

const app = express();


// Middlewares de seguridad
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting general
app.use(generalLimiter);

// Middlewares generales
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Cleaning System API',
    version: '1.0.0'
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Bienvenido a la API del sistema de limpieza'
  });
});

// Rutas principales
app.use('/api/auth', authRoutes);
app.use('/api/cleaning', cleaningRoutes);
app.use('/api/admin', adminRoutes);

// Ruta no encontrada
app.use('*', (req, res, next) => {
  const err = new Error(`Ruta ${req.originalUrl} no encontrada`);
  err.statusCode = 404;
  next(err);
});

// Middleware global de manejo de errores
app.use(globalErrorHandler);

module.exports = app;