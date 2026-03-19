import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry 4xx errors (validation/auth errors)
        const err = error as any
        if (err && typeof err.status === 'number') {
          if (err.status >= 400 && err.status < 500) return false
        }
        return failureCount < 3
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: (failureCount, error) => {
        const err = error as any
        if (err && typeof err.status === 'number') {
          if (err.status >= 400 && err.status < 500) return false
        }
        return failureCount < 2
      },
    },
  },
})
