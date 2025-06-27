import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ToastContainer } from "react-toastify";
import App from './App.jsx'
import { Provider } from 'react-redux';
import { persistor, store } from './store';
import { PersistGate } from 'redux-persist/integration/react';
createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <Provider store={store}>
      <PersistGate loading = {<div>loding....</div>} persistor={persistor}>  
        <ToastContainer />
        <App />
      </PersistGate>
    </Provider>
  //</StrictMode>
  ,
)
