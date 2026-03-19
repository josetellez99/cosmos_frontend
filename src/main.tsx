import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from "react-router";
import { QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import { AuthContextProvider } from "@/providers/AuthContextProvider";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorBoundaryUI } from "@/components/ui/error-boundary-ui";
import { queryClient } from '@/lib/queryClient'

window.addEventListener('unhandledrejection', (event) => {
  event.preventDefault()
  console.error('Unhandled async error:', event.reason)
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthContextProvider>
          <ErrorBoundary fallback={<ErrorBoundaryUI />}>
            <App />
          </ErrorBoundary>
        </AuthContextProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
