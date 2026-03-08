import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/zodSchemas/auth/register-schema";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { FormField } from "@/components/ui/form-field";

import {
    FieldSet,
    FieldGroup,
} from "@/components/ui/field";
import type { RegisterSchema } from "@/zodSchemas/auth/register-schema";

export const RegisterForm = () => {

    const { registerUser } = useAuth();
    const navigate = useNavigate();

    const form = useForm<RegisterSchema>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            lastName: "",
            birthDate: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const { isSubmitting } = form.formState;

    const onSubmit = async (data: RegisterSchema) => {
        const response = await registerUser(data);
        if (response.ok) {
            navigate("/confirm-email");
        } else {
            if (response.error.details) {
                Object.entries(response.error.details).forEach(([key, value]) => {
                    form.setError(key as any, {
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
                <Typography variant="h3">Crear una cuenta</Typography>
                <Typography variant="p">Organiza tu vida y mide tus metas</Typography>
            </div>
            <FieldSet className="mb-8">
                <FieldGroup>
                    <FormField 
                        name="name" 
                        control={form.control} 
                        label="Nombre" 
                        placeholder="Maria" 
                        type="text" 
                    />
                    <FormField 
                        name="lastName" 
                        control={form.control} 
                        label="Apellido" 
                        placeholder="Rodriguez" 
                        type="text" 
                    />
                    <FormField 
                        name="birthDate" 
                        control={form.control} 
                        label="Fecha de nacimiento" 
                        placeholder="DD/MM/YYYY" 
                        type="date" 
                    />
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
                    <FormField 
                        name="confirmPassword" 
                        control={form.control} 
                        label="Confirmar contraseña" 
                        placeholder="********" 
                        type="password" 
                    />
                    {/* <Controller
                        name="name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}><Typography variant="p">Nombre</Typography></FieldLabel>
                                <Input id={field.name} type="text" placeholder="Maria" {...field} />
                                {fieldState.invalid && (
                                    <FieldError>{fieldState.error?.message}</FieldError>
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="lastName"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}><Typography variant="p">Apellido</Typography></FieldLabel>
                                <Input id={field.name} type="text" placeholder="Rodriguez" {...field} />
                                {fieldState.invalid && (
                                    <FieldError>{fieldState.error?.message}</FieldError>
                                )}
                            </Field>
                        )}
                    /> */}
                </FieldGroup>
                {/* <Controller
                    name="birthDate"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}><Typography variant="p">Fecha de nacimiento</Typography></FieldLabel>
                            <Input id={field.name} type="date" {...field} />
                            {fieldState.invalid && (
                                <FieldError>{fieldState.error?.message}</FieldError>
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}><Typography variant="p">Correo electrónico</Typography></FieldLabel>
                            <Input id={field.name} type="email" placeholder="micorreo@dominio.com" {...field} />
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
                            <FieldLabel htmlFor={field.name}><Typography variant="p">Contraseña</Typography></FieldLabel>
                            <Input id={field.name} type="password" placeholder="********" {...field} />
                            {fieldState.invalid && (
                                <FieldError>{fieldState.error?.message}</FieldError>
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="confirmPassword"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}><Typography variant="p">Confirmar contraseña</Typography></FieldLabel>
                            <Input id={field.name} type="password" placeholder="********" {...field} />
                            {fieldState.invalid && (
                                <FieldError>{fieldState.error?.message}</FieldError>
                            )}
                        </Field>
                    )}
                /> */}
            </FieldSet>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="animate-spin" />}
                Registrarse
            </Button>
            {form.formState.errors.root && (
                <Typography variant="p" className="text-xs text-red-500">
                    {form.formState.errors.root.message}
                </Typography>
            )}
            <div className="flex justify-center">
                <Typography variant="p" className="text-xs">
                    ¿Ya tienes cuenta? <Link to="/login" className="text-primary font-bold">Inicia sesión</Link>
                </Typography>
            </div>
        </form>
    );
};