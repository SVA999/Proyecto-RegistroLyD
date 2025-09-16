import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material';
import {
  Login as LoginIcon,
  PersonAdd,
  CleaningServices,
  Security,
  Analytics,
  DeviceHub,
  CheckCircle,
  School,
  Business,
} from '@mui/icons-material';

import Silk from '../components/common/Silk';
//import { color } from '@mui/system';

function LandingPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const features = [
    {
      icon: <CleaningServices sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Registro Digital',
      description: 'Digitaliza el registro de limpieza y desinfección de manera eficiente.'
    },
    {
      icon: <Security sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: 'Cumplimiento Normativo',
      description: 'Cumple con la Resolución 2674/2013 y Ley 527/1999.'
    },
    {
      icon: <Analytics sx={{ fontSize: 40, color: 'tertiary.main' }} />,
      title: 'Reportes y Análisis',
      description: 'Genera reportes detallados y análisis de datos en tiempo real.'
    },
    {
      icon: <DeviceHub sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Multi-dispositivo',
      description: 'Accede desde cualquier dispositivo móvil, tablet o computador.'
    }
  ];

  const stats = [
    { number: '700+', label: 'Hojas/Mes Digitalizadas' },
    { number: '100%', label: 'Reducción Papel' },
    { number: '24/7', label: 'Disponibilidad' }
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Header con Silk */}

      <Silk
        speed={5}
        scale={0.6}
        color={theme.palette.primary.main}
        noiseIntensity={0.5}
        rotation={0}
        className="hero-silk"
      >
        <Box 
          sx={{
            color: 'white',
            py: { xs: 6, md: 8 },
            minHeight: { xs: '70vh', md: '80vh' },
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            zIndex: 2,
          }}
        >

          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={8}>
                {/* Logos institucionales */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <School sx={{ fontSize: 32, color: 'rgba(255,255,255,0.9)' }} />
                    <Typography variant="h6" fontWeight="bold">
                      UPB
                    </Typography>
                  </Box>
                  <Box sx={{ width: 2, height: 24, bgcolor: 'rgba(255,255,255,0.3)' }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Business sx={{ fontSize: 32, color: 'rgba(255,255,255,0.9)' }} />
                    <Typography variant="h6" fontWeight="bold">
                      A&S
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  variant={isMobile ? 'h3' : 'h2'}
                  component="h1"
                  fontWeight="bold"
                  gutterBottom
                  sx={{
                    background: 'linear-gradient(45deg, #ffffff 30%, #e3f2fd 90%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 2,
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                  }}
                >
                  Sistema de Registro
                </Typography>

                <Typography
                  variant={isMobile ? 'h5' : 'h4'}
                  component="h2"
                  fontWeight="500"
                  gutterBottom
                  sx={{ 
                    opacity: 0.95, 
                    mb: 3,
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                  }}
                >
                  Limpieza y Desinfección
                </Typography>

                <Typography
                  variant={isMobile ? 'h6' : 'h6'}
                  sx={{
                    opacity: 0.9,
                    mb: 4,
                    maxWidth: 600,
                    lineHeight: 1.6,
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                  }}
                >
                  Transforma el registro físico de limpieza en un sistema digital
                  moderno, eficiente y que cumple con todas las normativas vigentes.
                </Typography>

                {/* Botones principales */}
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    flexDirection: { xs: 'column', sm: 'row' },
                    mb: 4
                  }}
                >
                  <Button
                    component={Link}
                    to="/login"
                    variant="contained"
                    size="large"
                    startIcon={<LoginIcon />}
                    sx={{
                      py: 1.5,
                      px: 4,
                      fontSize: '1.1rem',
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      color: 'white',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                      '&:hover': {
                        backgroundColor: 'white',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                      },
                      borderRadius: 2,
                      textTransform: 'none',
                    }}
                  >
                    Iniciar Sesión
                  </Button>

                  <Button
                    component={Link}
                    to="/register"
                    variant="outlined"
                    size="large"
                    startIcon={<PersonAdd />}
                    sx={{
                      py: 1.5,
                      px: 4,
                      fontSize: '1.1rem',
                      borderColor: 'rgba(255,255,255,0.8)',
                      color: 'white',
                      borderWidth: 2,
                      fontWeight: 'bold',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        borderWidth: 2,
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                      },
                      borderRadius: 2,
                      textTransform: 'none',
                    }}
                  >
                    Crear Cuenta
                  </Button>
                </Box>

                {/* Indicadores de beneficios */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <CheckCircle sx={{ color: '#4CAF50', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Fácil de usar • Seguro • Cumplimiento normativo garantizado
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                {/* Estadísticas destacadas */}
                <Paper
                  elevation={12}
                  sx={{
                    p: 3,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(15px)',
                    borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.3)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  }}
                >
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    fontWeight="bold"
                    sx={{ 
                      color: 'white',
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                      filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                    }}
                  >
                    Impacto del Sistema
                  </Typography>
                  <Grid container spacing={2}>
                    {stats.map((stat, index) => (
                      <Grid item xs={6} key={index}>
                        <Box textAlign="center">
                          <Typography
                            variant="h4"
                            fontWeight="bold"
                            sx={{ 
                              lineHeight: 1,
                              color: 'white',
                              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                            }}
                          >
                            {stat.number}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ 
                              fontSize: '0.7rem',
                              color: 'rgba(255,255,255,0.9)',
                              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                            }}
                          >
                            {stat.label}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Silk>


      {/* Sección de características */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Box textAlign="center" sx={{ mb: 6 }}>
          <Typography
            variant={isMobile ? 'h4' : 'h3'}
            component="h2"
            fontWeight="bold"
            color="primary.main"
            gutterBottom
          >
            Características Principales
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: 'auto' }}
          >
            Todo lo que necesitas para modernizar tu sistema de registro de limpieza
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                  },
                  border: '1px solid rgba(0,0,0,0.06)',
                  borderRadius: 2,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                    color="text.primary"
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Sección de llamada a la acción */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #F8F9FA 0%, #E8F5E8 100%)',
          py: { xs: 6, md: 8 },
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={8}
            sx={{
              p: { xs: 4, md: 6 },
              textAlign: 'center',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              borderRadius: 3,
              border: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              component="h2"
              fontWeight="bold"
              color="primary.main"
              gutterBottom
            >
              ¿Listo para comenzar?
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4, maxWidth: 500, mx: 'auto', lineHeight: 1.6 }}
            >
              Únete al sistema de registro digital más moderno y eficiente.
              Mejora la productividad de tu equipo hoy mismo.
            </Typography>

            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'center',
                flexDirection: { xs: 'column', sm: 'row' },
                maxWidth: 400,
                mx: 'auto'
              }}
            >
              <Button
                component={Link}
                to="/register"
                variant="contained"
                size="large"
                startIcon={<PersonAdd />}
                sx={{
                  py: 1.5,
                  px: 4,
                  fontSize: '1.1rem',
                  flex: 1,
                }}
              >
                Crear Cuenta
              </Button>

              <Button
                component={Link}
                to="/login"
                variant="outlined"
                size="large"
                startIcon={<LoginIcon />}
                sx={{
                  py: 1.5,
                  px: 4,
                  fontSize: '1.1rem',
                  flex: 1,
                }}
              > 
                Iniciar Sesión
              </Button>
            </Box>

            <Divider sx={{ my: 4 }} />

            <Typography variant="caption" color="text.secondary">
              Sistema desarrollado para la Universidad Pontificia Bolivariana (UPB)<br />
              En colaboración con A&S Servicios Especializados
            </Typography>
          </Paper>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          backgroundColor: 'grey.900',
          color: 'white',
          py: 3,
          textAlign: 'center',
        }}
      >
        <Container>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © 2025 Sistema de Registro de Limpieza y Desinfección - UPB
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.6 }}>
            Versión 1.0.0 • Transformación Digital
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default LandingPage;