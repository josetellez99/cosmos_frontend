import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

export const ErrorBoundaryUI = () => {
    return (
        <div>
            <Typography variant="h1">Error</Typography>
            <Typography variant="p">Ocurrió un error inesperado</Typography>
            <Button onClick={() => window.location.reload()}>Recargar</Button>
        </div>
    )
}