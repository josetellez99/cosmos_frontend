import { useSearchParams, useNavigate } from "react-router";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useEffect, useState } from "react";
import { AuthLayout } from "@/components/layouts/auth-layout";
import { Typography } from "@/components/ui/typography";
import { Loader2, CircleCheck, CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const REDIRECT_DELAY = 5000;

export const VerifyEmailPage = () => {
    const { verifyEmail } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const type = searchParams.get("type");

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [error, setError] = useState<string | null>(null);
    const [countdown, setCountdown] = useState(REDIRECT_DELAY / 1000);

    useEffect(() => {
        const init = async () => {
            if (!token || !type) {
                setStatus("error");
                setError("El enlace de verificación es inválido.");
                return;
            }

            try {
                const response = await verifyEmail({ tokenHash: token, type });
                if (response.ok) {
                    setStatus("success");
                } else {
                    setStatus("error");
                    setError(response.message || "No se pudo verificar el correo.");
                }
            } catch {
                setStatus("error");
                setError("Ocurrió un error inesperado.");
            }
        };
        init();
    }, [token, type]);

    useEffect(() => {
        if (status !== "success") return;

        const interval = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        const timeout = setTimeout(() => {
            navigate("/login");
        }, REDIRECT_DELAY);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [status, navigate]);

    return (
        <AuthLayout>
            <div className="max-w-sm w-full bg-white py-10 px-6 card-radius flex flex-col items-center text-center space-y-4">
                {status === "loading" && (
                    <>
                        <Loader2 className="size-12 text-primary animate-spin" />
                        <Typography variant="h3">Verificando</Typography>
                        <Typography variant="p" className="text-sm text-muted-foreground">
                            Estamos confirmando tu correo electrónico...
                        </Typography>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="flex items-center justify-center size-16 rounded-full bg-green-100">
                            <CircleCheck className="size-8 text-green-600" />
                        </div>
                        <Typography variant="h3">Correo verificado</Typography>
                        <Typography variant="p" className="text-sm text-muted-foreground">
                            Tu cuenta ha sido activada. Serás redirigido al inicio de sesión en {countdown} segundos.
                        </Typography>
                        <div className="pt-2 w-full">
                            <Button className="w-full" asChild>
                                <Link to="/login">Ir al inicio de sesión</Link>
                            </Button>
                        </div>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="flex items-center justify-center size-16 rounded-full bg-red-100">
                            <CircleX className="size-8 text-red-600" />
                        </div>
                        <Typography variant="h3">Error de verificación</Typography>
                        <Typography variant="p" className="text-sm text-muted-foreground">
                            {error}
                        </Typography>
                        <div className="pt-2 w-full">
                            <Button variant="outline" className="w-full" asChild>
                                <Link to="/register">Volver al registro</Link>
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </AuthLayout>
    );
};
