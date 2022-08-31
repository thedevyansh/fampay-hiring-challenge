import React from 'react';
import { ColorModeScript } from '@chakra-ui/react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { config } from './theme';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={config.initialColorMode} />
    <App />
  </React.StrictMode>
);
