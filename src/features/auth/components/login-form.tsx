import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "@/zodSchemas/auth/login-schema";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Loader2 } from "lucide-react";
import {
    Field,
    FieldSet,
    FieldError,
    FieldLabel,
} from "@/components/ui/field";

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
                <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>
                                <Typography variant="p">Correo electrónico</Typography>
                            </FieldLabel>
                            <Input
                                id={field.name}
                                type="email"
                                placeholder="micorreo@dominio.com"
                                {...field}
                            />
                            {fieldState.invalid && (
                                <FieldError>{fieldState.error?.message}</FieldError>
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>
                                <Typography variant="p">Contraseña</Typography>
                            </FieldLabel>
                            <Input
                                id={field.name}
                                type="password"
                                placeholder="********"
                                {...field}
                            />
                            {fieldState.invalid && (
                                <FieldError>{fieldState.error?.message}</FieldError>
                            )}
                        </Field>
                    )}
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
