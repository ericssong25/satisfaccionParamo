import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Manejo de errores globales
window.addEventListener('error', (event) => {
  console.error('Error global capturado:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Promise rechazada:', event.reason);
});

// Verificar que el elemento root existe
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('No se encontró el elemento root');
  document.body.innerHTML = '<div style="padding: 20px; color: red;">Error: No se pudo cargar la aplicación</div>';
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
