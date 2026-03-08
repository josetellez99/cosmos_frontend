import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "@/zodSchemas/auth/login-schema";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Loader2 } from "lucide-react";
import {
    FieldSet,
} from "@/components/ui/field";
import { FormField } from "@/components/ui/form-field";

export const LoginForm = () => {
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const { isSubmitting } = form.formState;

    const onSubmit = async (data: LoginSchema) => {
        const response = await loginUser(data);
        if (response.ok) {
            navigate("/");
        } else {
            if (response.error.details) {
                Object.entries(response.error.details).forEach(([key, value]) => {
                    form.setError(key as keyof LoginSchema, {
                        type: "manual",
                        message: value,
                    });
                });
            } else {
                form.setError("root", {
                    message: response.message || "Ocurrió un error inesperado",
                });
            }
        }
    };

    return (
        <form
            className="max-w-sm w-full space-y-3 bg-white py-8 px-4 card-radius"
            onSubmit={form.handleSubmit(onSubmit)}
        >
            <div className="flex flex-col justify-center items-center mb-8">
                <Typography variant="h3">Iniciar sesión</Typography>
                <Typography variant="p">Bienvenido de nuevo a Cosmos</Typography>
            </div>
            <FieldSet className="mb-8">
                <FormField 
                    name="email" 
                    control={form.control} 
                    label="Correo electrónico" 
                    placeholder="micorreo@dominio.com" 
                    type="email" 
                />
                <FormField 
                    name="password" 
                    control={form.control} 
                    label="Contraseña" 
                    placeholder="********" 
                    type="password" 
                />
            </FieldSet>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="animate-spin" />}
                Entrar
            </Button>
            {form.formState.errors.root && (
                <Typography variant="p" className="text-xs text-red-500">
                    {form.formState.errors.root.message}
                </Typography>
            )}
            <div className="flex justify-center">
                <Typography variant="p" className="text-xs">
                    ¿No tienes cuenta? <Link to="/register" className="text-primary font-bold">Regístrate</Link>
                </Typography>
            </div>
        </form>
    );
};
