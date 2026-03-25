import { type ReactNode, Suspense } from 'react'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { Typography } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'

const SectionErrorFallback = ({ onRetry }: { onRetry: () => void }) => (
    <div className="flex flex-col items-center gap-3 py-6">
        <Typography variant="p" className="text-muted-foreground text-sm">
            Algo salió mal al cargar esta sección.
        </Typography>
        <Button variant="outline" size="sm" onClick={onRetry}>
            Intentar de nuevo
        </Button>
    </div>
)

interface AsyncBoundaryProps {
    children: ReactNode
    loadingFallback: ReactNode
}

export const AsyncBoundary = ({ children, loadingFallback }: AsyncBoundaryProps) => (
    <QueryErrorResetBoundary>
        {({ reset }) => (
            <ErrorBoundary
                onReset={reset}
                fallbackRender={({ resetErrorBoundary }) => (
                    <SectionErrorFallback onRetry={resetErrorBoundary} />
                )}
            >
                <Suspense fallback={loadingFallback}>
                    {children}
                </Suspense>
            </ErrorBoundary>
        )}
    </QueryErrorResetBoundary>
)
