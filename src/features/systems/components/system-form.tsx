import { useState } from "react"
import { FormProvider, useForm, type FieldErrors } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router"
import { FormField } from "@/components/ui/form-field"
import { Typography } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { FieldSet, FieldGroup } from "@/components/ui/field"
import { FormStatus, type FormStatusState } from "@/components/ui/form-status"
import { EmojiPickerField } from "@/features/habits/components/form/emoji-picker-field"
import { GoalsLinkingSection } from "@/features/goals/components/form/goals-linking-section"
import { HabitsLinkingSection } from "@/features/systems/components/form/habits-linking-section"
import { useCreateSystem } from "@/features/systems/hooks/useCreateSystem"
import { systemFormSchema } from "@/features/systems/schemas/system-form-schema"
import type { SystemFormValues } from "@/features/systems/types/form/system-form"
import type { CreateSystemRequest } from "@/features/systems/types/request/create-system"
import { asISODateString } from "@/types/dates"
import { appRoutes } from "@/lib/constants/routes"

interface props {
    isEditing: boolean
    initialValues: SystemFormValues
}

export const SystemForm = ({ isEditing, initialValues }: props) => {

    const { mutate, isPending } = useCreateSystem()
    const [status, setStatus] = useState<FormStatusState>({ kind: "idle" })
    const navigate = useNavigate()

    const form = useForm<SystemFormValues>({
        resolver: zodResolver(systemFormSchema),
        defaultValues: initialValues,
    })

    const onValid = (data: SystemFormValues) => {
        setStatus({ kind: "idle" })

        const request: CreateSystemRequest = {
            name: data.name,
            description: data.description,
            symbol: data.symbol,
            startingDate: asISODateString(data.startingDate),
            habits: data.habits,
            goalLinks: data.goalLinks,
        }

        mutate(request, {
            onSuccess: () => {
                setStatus({ kind: "success", message: "Sistema creado correctamente" })
                navigate(`/${appRoutes.SYSTEMS.ROOT}`)
            },
            onError: (err) => {
                setStatus({
                    kind: "error",
                    message: err.message ?? "No se pudo crear el sistema, intenta de nuevo",
                })
            },
        })
    }

    const onInvalid = (errors: FieldErrors<SystemFormValues>) => {
        console.log("[SystemForm] validation errors", errors)
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onValid, onInvalid)}>
                <FieldSet>
                    <Typography variant="h3">
                        {isEditing ? "Editar sistema" : "Crear sistema"}
                    </Typography>
                    <FieldGroup>
                        <FormField
                            name="name"
                            control={form.control}
                            label="Nombre"
                            placeholder="Mi sistema"
                            type="text"
                        />
                        <EmojiPickerField
                            name="symbol"
                            control={form.control}
                            label="Simbolo"
                        />
                    </FieldGroup>
                    <FormField
                        name="description"
                        control={form.control}
                        label="Descripcion"
                        placeholder="Descripcion del sistema"
                        type="text"
                    />
                    <FormField
                        name="startingDate"
                        control={form.control}
                        label="Fecha de inicio"
                        placeholder=""
                        type="date"
                    />
                    <div className="flex flex-col gap-2">
                        <Typography variant="p">Habitos vinculados</Typography>
                        <HabitsLinkingSection />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Typography variant="p">Metas vinculadas</Typography>
                        <GoalsLinkingSection />
                    </div>
                    <FormStatus state={status} />
                    <Button type="submit" disabled={isPending} isLoading={isPending}>
                        {isEditing ? "Guardar cambios" : "Crear sistema"}
                    </Button>
                </FieldSet>
            </form>
        </FormProvider>
    )
}
