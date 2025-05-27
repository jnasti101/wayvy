import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from '@/contexts/AuthContext';
import { SurfboardProvider } from '@/contexts/SurfboardContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <SurfboardProvider>
        <App />
      </SurfboardProvider>
    </AuthProvider>
  </React.StrictMode>,
);
