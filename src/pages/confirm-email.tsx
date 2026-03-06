import { Typography } from "@/components/ui/typography"
import { AuthLayout } from "@/components/layouts/auth-layout"
import { Button } from "@/components/ui/button"
import { Link } from "react-router"
import { Mail } from "lucide-react"

export const ConfirmEmail = () => {
    return (
        <AuthLayout>
            <div className="max-w-sm w-full bg-white py-10 px-6 card-radius flex flex-col items-center text-center space-y-4">
                <div className="flex items-center justify-center size-16 rounded-full bg-primary/10">
                    <Mail className="size-8 text-primary" />
                </div>
                <Typography variant="h3">Revisa tu correo</Typography>
                <Typography variant="p" className="text-sm text-muted-foreground">
                    Te hemos enviado un enlace de verificación. Abre tu correo electrónico y haz clic en el enlace para activar tu cuenta.
                </Typography>
                <div className="pt-2 w-full">
                    <Button variant="outline" className="w-full" asChild>
                        <Link to="/login">Volver al inicio de sesión</Link>
                    </Button>
                </div>
            </div>
        </AuthLayout>
    )
}
