import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/zodSchemas/auth/register-schema";
import * as z from "zod"
import {
    Field,
    FieldSet,
    FieldGroup,
    FieldLabel,
    FieldError,
} from "@/components/ui/field";

export const RegisterForm = () => {

    const form = useForm<z.infer<typeof registerSchema>>({
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

    const onSubmit = (data: z.infer<typeof registerSchema>) => {
        console.log(data);
    };

    return (
        <form
            className="max-w-sm w-full space-y-3 bg-white py-8 px-4 rounded-lg"
            onSubmit={form.handleSubmit(onSubmit)}
        >
            <div className="flex justify-center">
                <Typography variant="h3">Crear una cuenta</Typography>
            </div>
            <FieldSet>
                <FieldGroup>
                    <Controller
                        name="name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Nombre</FieldLabel>
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
                                <FieldLabel htmlFor={field.name}>Apellido</FieldLabel>
                                <Input id={field.name} type="text" placeholder="Rodriguez" {...field} />
                                {fieldState.invalid && (
                                    <FieldError>{fieldState.error?.message}</FieldError>
                                )}
                            </Field>
                        )}
                    />
                </FieldGroup>
                <Controller
                    name="birthDate"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Fecha de nacimiento</FieldLabel>
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
                            <FieldLabel htmlFor={field.name}>Correo electrónico</FieldLabel>
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
                            <FieldLabel htmlFor={field.name}>Contraseña</FieldLabel>
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
                            <FieldLabel htmlFor={field.name}>Confirmar contraseña</FieldLabel>
                            <Input id={field.name} type="password" placeholder="********" {...field} />
                            {fieldState.invalid && (
                                <FieldError>{fieldState.error?.message}</FieldError>
                            )}
                        </Field>
                    )}
                />
            </FieldSet>
            <Button type="submit" className="w-full">Registrarse</Button>
        </form>
    );
};