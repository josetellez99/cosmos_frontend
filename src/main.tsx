import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from "react-router";
import App from './App.tsx'
import { AuthContextProvider } from "@/providers/AuthContextProvider";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorBoundaryUI } from "@/components/ui/error-boundary-ui";

window.addEventListener('unhandledrejection', (event) => {
  event.preventDefault()
  console.error('Unhandled async error:', event.reason)
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <ErrorBoundary fallback={<ErrorBoundaryUI />}>
          <App />
        </ErrorBoundary>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>,
)
