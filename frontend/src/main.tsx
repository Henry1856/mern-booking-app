// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
import ReactDom from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppContextProvider } from './contexts/AppContext.tsx';
// import { BrowserRouter } from 'react-router-dom'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry:0,
    },
  }
});

ReactDom.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </QueryClientProvider>
  </React.StrictMode>,
  // <BrowserRouter>
  //   <App />
  // </BrowserRouter>
)
