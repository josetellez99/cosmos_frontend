import * as React from "react";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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


// Strips seconds + Z so an ISO-8601 timestamp like "2025-12-31T23:59:00Z"
// can populate a native <input type="datetime-local"> (which expects "YYYY-MM-DDTHH:mm").
const isoToDatetimeLocal = (value: unknown): string => {
    if (typeof value !== 'string' || value.length < 16) return ''
    return value.slice(0, 16)
}

// Appends ":00Z" so what the user picks ("YYYY-MM-DDTHH:mm") is stored as a
// valid ISO-8601 timestamp with seconds defaulted to 00. Mirrors the existing
// `${date}T00:00:00.000Z` convention used elsewhere — input is treated as UTC literal.
const datetimeLocalToIso = (value: string): string => {
    if (!value) return ''
    return `${value}:00Z`
}

export const FormField = ({name, control, label, placeholder, type, transform} : props) => {
    const isDatetimeLocal = type === 'datetime-local'
    const isTextarea = type === 'textarea'

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => {
                const displayValue = isDatetimeLocal
                    ? isoToDatetimeLocal(field.value)
                    : field.value ?? ''

                const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                    if (isDatetimeLocal) {
                        const iso = datetimeLocalToIso(e.target.value)
                        field.onChange(transform ? transform(iso) : iso)
                        return
                    }
                    if (transform) {
                        field.onChange(transform(e.target.value))
                        return
                    }
                    field.onChange(e)
                }

                return (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                            <Typography variant="p">{label}</Typography>
                        </FieldLabel>
                        {isTextarea ? (
                            <Textarea
                                id={field.name}
                                placeholder={placeholder}
                                {...field}
                                value={displayValue}
                                onChange={handleChange}
                            />
                        ) : (
                            <Input
                                id={field.name}
                                type={type}
                                placeholder={placeholder}
                                {...field}
                                value={displayValue}
                                onChange={handleChange}
                            />
                        )}
                        {fieldState.invalid && (
                            <FieldError>{fieldState.error?.message}</FieldError>
                        )}
                    </Field>
                )
            }}
        />
    )
}