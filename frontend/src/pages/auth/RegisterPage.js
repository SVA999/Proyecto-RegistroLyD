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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  PersonAdd,
  Login as LoginIcon,
  Person,
  Badge,
} from '@mui/icons-material';

import { useAuth } from '../../contexts/AuthContext';

function RegisterPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const { register, isAuthenticated, isLoading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'OPERATOR', // Por defecto operario
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Limpiar errores al cambiar de página
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  // Validación del formulario
  const validateForm = () => {
    const errors = {};

    // Validar nombre
    if (!formData.name.trim()) {
      errors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'El correo electrónico es requerido';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Ingrese un correo electrónico válido';
    }

    // Validar contraseña
    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Debe confirmar la contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    return errors;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores del campo específico
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Limpiar error global al escribir
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (isSubmitting || isLoading) return;
    
    // Validar formulario
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    setFormErrors({});
    
    try {
      const result = await register({
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        role: formData.role
      });
      
      if (result.success) {
        // Mostrar mensaje de éxito y redirigir a login
        navigate('/login', { 
          replace: true,
          state: { 
            message: 'Cuenta creada exitosamente. Por favor, inicia sesión.',
            email: formData.email.toLowerCase().trim()
          }
        });
      }
    } catch (error) {
      console.error('Error en registro:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

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
            }}
          >
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              component="h1"
              fontWeight="bold"
              gutterBottom
            >
              Crear Cuenta
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Sistema de Registro de Limpieza
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                UPB • A&S
              </Typography>
            </Box>
          </Box>

          <CardContent sx={{ padding: 4 }}>
            {/* Mensaje de error */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
                {error}
              </Alert>
            )}

            {/* Formulario de registro */}
            <form onSubmit={handleSubmit} noValidate>
              <TextField
                fullWidth
                label="Nombre Completo"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                required
                autoComplete="name"
                autoFocus
                error={!!formErrors.name}
                helperText={formErrors.name}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Correo Electrónico"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                autoComplete="email"
                error={!!formErrors.email}
                helperText={formErrors.email}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="role-label">Rol</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  name="role"
                  value={formData.role}
                  label="Rol"
                  onChange={handleInputChange}
                  startAdornment={
                    <InputAdornment position="start">
                      <Badge color="action" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="OPERATOR">Operario</MenuItem>
                  <MenuItem value="ADMIN">Administrador</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Contraseña"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                required
                autoComplete="new-password"
                error={!!formErrors.password}
                helperText={formErrors.password}
                sx={{ mb: 2 }}
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

              <TextField
                fullWidth
                label="Confirmar Contraseña"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                autoComplete="new-password"
                error={!!formErrors.confirmPassword}
                helperText={formErrors.confirmPassword}
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
                        onClick={handleToggleConfirmPassword}
                        edge="end"
                        aria-label="toggle confirm password visibility"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                disabled={isSubmitting || isLoading}
                startIcon={
                  isSubmitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <PersonAdd />
                  )
                }
                sx={{
                  mb: 2,
                  py: 1.5,
                  fontSize: '1.1rem',
                }}
              >
                {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
              </Button>
            </form>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                o
              </Typography>
            </Divider>

            {/* Enlace a login */}
            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary" gutterBottom>
                ¿Ya tienes una cuenta?
              </Typography>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                startIcon={<LoginIcon />}
                fullWidth
                sx={{ py: 1.2 }}
              >
                Iniciar Sesión
              </Button>
            </Box>

            {/* Información adicional */}
            <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                Al crear una cuenta aceptas nuestros términos de uso y política de privacidad.
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Los administradores pueden gestionar usuarios una vez autenticados.
              </Typography>
            </Box>
          </CardContent>
        </Paper>
      </Container>
    </Box>
  );
}

export default RegisterPage;