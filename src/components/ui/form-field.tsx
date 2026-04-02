import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
    Field,
    FieldError,
    FieldLabel,
} from "@/components/ui/field";
import { Typography } from "@/components/ui/typography";
import type { Control } from "react-hook-form";

interface props {
    name: string;
    control: Control<any>;
    label: string;
    placeholder: string;
    type: string;
    error?: string;
    transform?: (value: string) => unknown;
}


export const FormField = ({name, control, label, placeholder, type, transform} : props) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                        <Typography variant="p">{label}</Typography>
                    </FieldLabel>
                    <Input
                        id={field.name}
                        type={type}
                        placeholder={placeholder}
                        {...field}
                        value={field.value ?? ''}
                        onChange={transform
                            ? (e) => field.onChange(transform(e.target.value))
                            : field.onChange
                        }
                    />
                    {fieldState.invalid && (
                        <FieldError>{fieldState.error?.message}</FieldError>
                    )}
                </Field>
            )}
        />
    )
}