import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Paper,
  Alert,
  AlertTitle 
} from '@mui/material';
import { ErrorOutline, Refresh, Home } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el state para mostrar la UI de error
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Captura detalles del error
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log del error para debugging
    console.error('ErrorBoundary capturó un error:', error, errorInfo);
    
    // Aquí podrías enviar el error a un servicio de logging
    // como Sentry, LogRocket, etc.
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'background.default',
            padding: 2,
          }}
        >
          <Container maxWidth="md">
            <Paper
              elevation={8}
              sx={{
                padding: 4,
                textAlign: 'center',
                borderRadius: 3,
              }}
            >
              {/* Icono de error */}
              <Box sx={{ mb: 3 }}>
                <ErrorOutline
                  sx={{
                    fontSize: 80,
                    color: 'error.main',
                    mb: 2,
                  }}
                />
              </Box>

              {/* Título del error */}
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                color="error"
                fontWeight="bold"
              >
                ¡Oops! Algo salió mal
              </Typography>

              <Typography
                variant="h6"
                color="text.secondary"
                gutterBottom
                sx={{ mb: 3 }}
              >
                Ha ocurrido un error inesperado en la aplicación
              </Typography>

              {/* Alerta con detalles para desarrollo */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
                  <AlertTitle>Detalles del Error (Desarrollo)</AlertTitle>
                  <Typography variant="body2" component="pre" sx={{ fontSize: '0.8rem' }}>
                    {this.state.error.toString()}
                  </Typography>
                  {this.state.errorInfo.componentStack && (
                    <Typography variant="body2" component="pre" sx={{ fontSize: '0.7rem', mt: 1 }}>
                      {this.state.errorInfo.componentStack}
                    </Typography>
                  )}
                </Alert>
              )}

              {/* Descripción para usuarios */}
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                No te preocupes, nuestro equipo ha sido notificado. 
                Mientras tanto, puedes intentar las siguientes acciones:
              </Typography>

              {/* Botones de acción */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Refresh />}
                  onClick={this.handleReload}
                  size="large"
                >
                  Recargar Página
                </Button>
                
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<Home />}
                  onClick={this.handleGoHome}
                  size="large"
                >
                  Ir al Inicio
                </Button>
              </Box>

              {/* Información de contacto */}
              <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
                <Typography variant="caption" color="text.secondary">
                  Si el problema persiste, contacta al administrador del sistema<br />
                  Sistema de Registro de Limpieza - UPB v1.0.0
                </Typography>
              </Box>
            </Paper>
          </Container>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;