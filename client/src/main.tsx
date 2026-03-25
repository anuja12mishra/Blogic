import { createRoot } from 'react-dom/client'
import './index.css'
import { ToastContainer } from "react-toastify";
import App from './App'
import { Provider } from 'react-redux';
import { persistor, store } from './store';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from './components/ThemeProvider'

import { useTheme } from './components/ThemeProvider'

function ThemedToastContainer() {
  const { theme } = useTheme();
  return <ToastContainer
    theme={theme === "light" ? "light" : "dark"} />;
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <Provider store={store}>
    <PersistGate loading={<div>loding....</div>} persistor={persistor}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <ThemedToastContainer />
        <App />
      </ThemeProvider>
    </PersistGate>
  </Provider>
)

