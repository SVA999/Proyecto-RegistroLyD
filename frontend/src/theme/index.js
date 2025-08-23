import { createTheme } from '@mui/material/styles';

// Paleta de colores basada en UPB (azul institucional) y A&S (verde corporativo)
const theme = createTheme({
  palette: {
    // Colores primarios - UPB
    primary: {
      main: '#1565C0', // Azul UPB institucional
      light: '#42A5F5', // Azul claro
      dark: '#0D47A1',  // Azul oscuro
      contrastText: '#ffffff',
    },
    // Colores secundarios - A&S
    secondary: {
      main: '#2E7D32', // Verde A&S corporativo
      light: '#66BB6A', // Verde claro
      dark: '#1B5E20',  // Verde oscuro
      contrastText: '#ffffff',
    },
    // Color terciario para destacados
    tertiary: {
      main: '#FF6F00', // Naranja de acento
      light: '#FFB74D',
      dark: '#E65100',
      contrastText: '#ffffff',
    },
    // Fondos y superficies
    background: {
      default: '#F8F9FA',     // Fondo general gris muy claro
      paper: '#FFFFFF',       // Fondo de cards/modales
      secondary: '#F1F3F4',   // Fondo secundario
    },
    // Textos
    text: {
      primary: '#212121',     // Texto principal
      secondary: '#757575',   // Texto secundario
      disabled: '#BDBDBD',    // Texto deshabilitado
    },
    // Estados de feedback
    success: {
      main: '#4CAF50',
      light: '#81C784',
      dark: '#388E3C',
      contrastText: '#ffffff',
    },
    error: {
      main: '#F44336',
      light: '#EF5350',
      dark: '#D32F2F',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#FF9800',
      light: '#FFB74D',
      dark: '#F57C00',
      contrastText: '#ffffff',
    },
    info: {
      main: '#2196F3',
      light: '#64B5F6',
      dark: '#1976D2',
      contrastText: '#ffffff',
    },
    // Grises para dividers y borders
    divider: 'rgba(0, 0, 0, 0.12)',
    grey: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
  },
  
  // Tipografía optimizada para mobile-first
  typography: {
    fontFamily: [
      '"Roboto"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    // Títulos principales
    h1: {
      fontSize: '2.25rem', // 36px
      fontWeight: 700,
      lineHeight: 1.2,
      color: '#1565C0',
      '@media (max-width:600px)': {
        fontSize: '1.875rem', // 30px en mobile
      },
    },
    h2: {
      fontSize: '1.875rem', // 30px
      fontWeight: 600,
      lineHeight: 1.3,
      color: '#1565C0',
      '@media (max-width:600px)': {
        fontSize: '1.5rem', // 24px en mobile
      },
    },
    h3: {
      fontSize: '1.5rem', // 24px
      fontWeight: 500,
      lineHeight: 1.4,
      color: '#2E7D32',
      '@media (max-width:600px)': {
        fontSize: '1.25rem', // 20px en mobile
      },
    },
    h4: {
      fontSize: '1.25rem', // 20px
      fontWeight: 500,
      lineHeight: 1.4,
      '@media (max-width:600px)': {
        fontSize: '1.125rem', // 18px en mobile
      },
    },
    h5: {
      fontSize: '1.125rem', // 18px
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem', // 16px
      fontWeight: 500,
      lineHeight: 1.5,
    },
    // Textos del cuerpo
    body1: {
      fontSize: '1rem', // 16px
      lineHeight: 1.6,
      color: '#212121',
    },
    body2: {
      fontSize: '0.875rem', // 14px
      lineHeight: 1.5,
      color: '#ffffffff',
    },
    // Botones y elementos interactivos
    button: {
      fontSize: '0.95rem',
      textTransform: 'none', // Sin mayúsculas automáticas
      fontWeight: 500,
      letterSpacing: '0.02em',
    },
    // Caption y textos pequeños
    caption: {
      fontSize: '0.75rem', // 12px
      lineHeight: 1.4,
      color: '#757575',
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
    },
  },

  // Bordes redondeados consistentes
  shape: {
    borderRadius: 8,
  },

  // Spacing personalizado (8px base)
  spacing: 8,

  // Customización de componentes
  components: {
    // Botones modernos con gradientes
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '12px 24px',
          fontSize: '0.95rem',
          fontWeight: 500,
          textTransform: 'none',
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #1565C0 30%, #1976D2 90%)',
          color: '#ffffff',
          '&:hover': {
            background: 'linear-gradient(45deg, #0D47A1 30%, #1565C0 90%)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(45deg, #2E7D32 30%, #388E3C 90%)',
          color: '#ffffff',
          '&:hover': {
            background: 'linear-gradient(45deg, #1B5E20 30%, #2E7D32 90%)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
            backgroundColor: 'rgba(21, 101, 192, 0.04)',
          },
        },
      },
    },

    // Cards con diseño moderno
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.06)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },

    // AppBar con gradiente UPB/A&S
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #1565C0 0%, #2E7D32 100%)',
          boxShadow: '0 2px 12px rgba(21,101,192,0.2)',
        },
      },
    },

    // TextField con bordes mejorados
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#FAFAFA',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: '#F5F5F5',
              '& fieldset': {
                borderColor: '#1565C0',
                borderWidth: '2px',
              },
            },
            '&.Mui-focused': {
              backgroundColor: '#FFFFFF',
              '& fieldset': {
                borderColor: '#1565C0',
                borderWidth: '2px',
              },
            },
          },
          '& .MuiInputLabel-outlined.Mui-focused': {
            color: '#1565C0',
          },
        },
      },
    },

    // Paper con bordes sutiles
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        elevation1: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        },
        elevation4: {
          boxShadow: '0 4px 6px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.1)',
        },
      },
    },

    // Chips con diseño moderno
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
        colorPrimary: {
          backgroundColor: '#E3F2FD',
          color: '#1565C0',
        },
        colorSecondary: {
          backgroundColor: '#E8F5E8',
          color: '#2E7D32',
        },
      },
    },

    // Loading buttons
    MuiLoadingButton: {
      styleOverrides: {
        root: {
          '&.MuiLoadingButton-loading': {
            color: 'transparent',
          },
        },
      },
    },
  },

  // Breakpoints responsivos mobile-first
  breakpoints: {
    values: {
      xs: 0,      // 0px+
      sm: 600,    // 600px+ (mobile landscape)
      md: 900,    // 900px+ (tablet)
      lg: 1200,   // 1200px+ (desktop)
      xl: 1536,   // 1536px+ (large desktop)
    },
  },

  // Transiciones suaves
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
});

/*
  Si necesitas agregar propiedades personalizadas al tema en JS, simplemente añádelas al objeto 'theme' arriba.
  Por ejemplo:
  theme.custom = {
    tertiary: theme.palette.tertiary,
    // Otros colores o propiedades personalizadas aquí
  };
*/
export default theme;