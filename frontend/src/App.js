import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

// Importar tema personalizado
import theme from './theme';

// Importar contexto de autenticación
import { AuthProvider } from './contexts/AuthContext';

// Importar componentes principales
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardOperator from './pages/operator/DashboardOperator';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Importar componente de error global
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingScreen from './components/common/LoadingScreen';

// Configurar dayjs en español
dayjs.locale('es');

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider 
          dateAdapter={AdapterDayjs} 
          adapterLocale="es"
          dateFormats={{
            keyboardDate: 'DD/MM/YYYY',
            normalDate: 'DD/MM/YYYY',
          }}
        >
          <AuthProvider>
            <Router>
              <Box 
                sx={{ 
                  minHeight: '100vh', 
                  backgroundColor: 'background.default',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Routes>
                  {/* Página de inicio - Landing Page */}
                  <Route path="/" element={<LandingPage />} />
                  
                  {/* Rutas públicas */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  
                  {/* Rutas protegidas para operarios */}
                  <Route 
                    path="/operator/*" 
                    element={
                      <ProtectedRoute allowedRoles={['OPERATOR']}>
                        <DashboardOperator />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Rutas protegidas para administradores */}
                  <Route 
                    path="/admin/*" 
                    element={
                      <ProtectedRoute allowedRoles={['ADMIN']}>
                        <DashboardAdmin />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Ruta 404 - redirigir a landing */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Box>
            </Router>
          </AuthProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;