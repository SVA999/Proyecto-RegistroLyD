import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Configuración de PWA (Service Worker)
//import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/*
// Registrar Service Worker para PWA
// En producción se habilita automáticamente
if (process.env.NODE_ENV === 'production') {
  serviceWorkerRegistration.register();
} else {
  // En desarrollo, solo registrar si está habilitado explícitamente
  if (process.env.REACT_APP_ENABLE_SW === 'true') {
    serviceWorkerRegistration.register();
  } else {
    serviceWorkerRegistration.unregister();
  }
}*/

// Medir performance de la aplicación
reportWebVitals(console.log);