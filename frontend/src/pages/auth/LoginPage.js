import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  Container,
  Paper,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  PersonAdd,
  ArrowBack,
} from '@mui/icons-material';

import { useAuth } from '../../contexts/AuthContext';

function LoginPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  //const { login, isAuthenticated, isLoading, error, clearError, user, initialLoadComplete } = useAuth();
  const { login, isAuthenticated, isLoading, error, clearError, user } = useAuth();

  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mensaje de éxito desde registro
  const successMessage = location.state?.message;

// Solo redirigir si está autenticado Y la carga inicial está completa
  // Solo redirigir si está autenticado y no está cargando
  useEffect(() => {
    //if (isAuthenticated && user && initialLoadComplete) {
    if (isAuthenticated && user && !isLoading) {
      const from = location.state?.from?.pathname;
      
      // Si viene de una ruta protegida, ir ahí
      if (from && from !== '/') {
        navigate(from, { replace: true });
      } else {
        // Redirigir según el rol
        const redirectPath = user.role === 'ADMIN' ? '/admin' : '/operator';
        navigate(redirectPath, { replace: true });
      }
    }
  //}, [isAuthenticated, user, navigate, location.state, initialLoadComplete]);
  }, [isAuthenticated, user, navigate, location.state, isLoading]);

  // Limpiar errores al cambiar de página
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  // Limpiar mensaje de éxito después de un tiempo
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        // Limpiar el mensaje del state
        window.history.replaceState({}, document.title);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error al escribir
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (isSubmitting || isLoading) return;
    
    // Validación básica
    if (!formData.email.trim() || !formData.password) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // La redirección se manejará por el useEffect
        // No necesitamos hacer navigate aquí
      }
    } catch (error) {
      console.error('Error en login:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleBackToHome = () => {
    navigate('/', { replace: true });
  };

  // Mostrar loading si aún no se ha completado la carga inicial
  //if (!initialLoadComplete && isLoading) {

  // Mostrar loading si está cargando la autenticación inicial
  if (isLoading && !isAuthenticated) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1565C0 0%, #2E7D32 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <CircularProgress size={50} sx={{ color: 'white' }} />
        <Typography variant="body1" sx={{ color: 'white' }}>
          Verificando autenticación...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1565C0 0%, #2E7D32 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            backgroundColor: 'background.paper',
          }}
        >
          {/* Header con logos */}
          <Box
            sx={{
              background: 'linear-gradient(90deg, #1565C0 0%, #2E7D32 100%)',
              color: 'white',
              padding: 4,
              textAlign: 'center',
              position: 'relative',
            }}
          >
            {/* Botón de volver */}
            <IconButton
              onClick={handleBackToHome}
              sx={{
                position: 'absolute',
                left: 16,
                top: 16,
                color: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)',
                },
              }}
            >
              <ArrowBack />
            </IconButton>

            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              component="h1"
              fontWeight="bold"
              gutterBottom
            >
              Sistema de Registro
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Limpieza y Desinfección
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                UPB • A&S
              </Typography>
            </Box>
          </Box>

          <CardContent sx={{ padding: 4 }}>
            {/* Mensaje de éxito desde registro */}
            {successMessage && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {successMessage}
              </Alert>
            )}

            {/* Mensaje de error */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
                {error}
              </Alert>
            )}

            {/* Formulario de login */}
            <form onSubmit={handleSubmit} noValidate>
              <TextField
                fullWidth
                label="Correo Electrónico"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                autoComplete="email"
                autoFocus={!formData.email}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Contraseña"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                required
                autoComplete="current-password"
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePassword}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isSubmitting || isLoading || !formData.email.trim() || !formData.password}
                startIcon={
                  isSubmitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <LoginIcon />
                  )
                }
                sx={{
                  mb: 2,
                  py: 1.5,
                  fontSize: '1.1rem',
                }}
              >
                {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                o
              </Typography>
            </Divider>

            {/* Enlace a registro */}
            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary" gutterBottom>
                ¿No tienes una cuenta?
              </Typography>
              <Button
                component={Link}
                to="/register"
                variant="outlined"
                startIcon={<PersonAdd />}
                fullWidth
                sx={{ py: 1.2 }}
              >
                Crear Cuenta
              </Button>
            </Box>

            {/* Usuarios de prueba - solo en desarrollo */}
            {process.env.NODE_ENV === 'development' && (
              <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                  Usuarios de prueba:
                </Typography>
                <Typography variant="caption" display="block">
                  Admin: admin@upb.edu.co / admin123
                </Typography>
                <Typography variant="caption" display="block">
                  Operario1: operario1@upb.edu.co / operator123
                </Typography>
                <Typography variant="caption" display="block">
                  Operario2: operario2@upb.edu.co / operator123
                </Typography>
              </Box>
            )}
          </CardContent>
        </Paper>
      </Container>
    </Box>
  );
}

export default LoginPage;