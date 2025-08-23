import React from 'react';
import { 
  Box, 
  CircularProgress, 
  Typography, 
  Paper,
  LinearProgress 
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

function LoadingScreen({ 
  message = 'Cargando...', 
  variant = 'circular', 
  fullScreen = true,
  showProgress = false,
  progress = 0 
}) {
  const theme = useTheme();

  const LoadingContent = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        textAlign: 'center',
      }}
    >
      {/* Logo/Branding */}
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: 2,
          background: 'linear-gradient(45deg, #1565C0 30%, #2E7D32 90%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 1,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          color="white"
        >
          UPB
        </Typography>
      </Box>

      {/* Indicador de carga */}
      {variant === 'circular' ? (
        <CircularProgress
          size={50}
          thickness={4}
          sx={{
            color: theme.palette.primary.main,
          }}
        />
      ) : (
        <Box sx={{ width: '100%', maxWidth: 300 }}>
          <LinearProgress
            variant={showProgress ? 'determinate' : 'indeterminate'}
            value={showProgress ? progress : undefined}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: theme.palette.grey[200],
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                background: 'linear-gradient(45deg, #1565C0 30%, #2E7D32 90%)',
              },
            }}
          />
          {showProgress && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              {Math.round(progress)}%
            </Typography>
          )}
        </Box>
      )}

      {/* Mensaje de carga */}
      <Typography
        variant="h6"
        color="text.secondary"
        fontWeight={500}
      >
        {message}
      </Typography>

      {/* Información adicional */}
      <Typography variant="caption" color="text.disabled">
        Sistema de Registro de Limpieza y Desinfección
      </Typography>
    </Box>
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.palette.background.default,
          zIndex: theme.zIndex.modal + 1,
          padding: 2,
        }}
      >
        <Paper
          elevation={8}
          sx={{
            padding: 6,
            borderRadius: 3,
            minWidth: 300,
            maxWidth: 400,
          }}
        >
          <LoadingContent />
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
        padding: 3,
      }}
    >
      <LoadingContent />
    </Box>
  );
}

export default LoadingScreen;