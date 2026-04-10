import { useState } from "react"
import { FormProvider, useForm, type FieldErrors } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormField } from "@/components/ui/form-field"
import { Typography } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { FieldSet, FieldGroup } from "@/components/ui/field"
import { FormStatus, type FormStatusState } from "@/components/ui/form-status"
import type { CreateHabitRequest } from "@/features/habits/types/request/create-habit"
import type { HabitFormValues } from "@/features/habits/types/form/habit-form"
import { habitFormSchema } from "@/features/habits/schemas/habit-form-schema"
import { asISODateString } from "@/types/dates"
import { EmojiPickerField } from "@/features/habits/components/form/emoji-picker-field"
import { ScheduleInput } from "@/features/habits/components/form/schedule-input"
import { GoalsLinkingSection } from "@/features/goals/components/form/goals-linking-section"
import { SystemsLinkingSection } from "@/features/habits/components/form/systems-linking-section"
import { useCreateHabit } from "@/features/habits/hooks/useCreateHabit"
import { useNavigate } from "react-router"
import { appRoutes } from "@/lib/constants/routes"

interface props {
    isEditing: boolean
    initialValues: HabitFormValues
}

export const HabitForm = ({ isEditing, initialValues }: props) => {

    const { mutate, isPending } = useCreateHabit()
    const [status, setStatus] = useState<FormStatusState>({ kind: "idle" })
    const navigate = useNavigate()

    const form = useForm<HabitFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- superRefine changes zod's inferred output type
        resolver: zodResolver(habitFormSchema) as any,
        defaultValues: initialValues,
    })

    const onValid = (data: HabitFormValues) => {
        setStatus({ kind: "idle" })

        const request: CreateHabitRequest = {
            name: data.name,
            description: data.description,
            emoji: data.emoji,
            startingDate: asISODateString(data.startingDate),
            scheduleType: data.scheduleType,
            scheduleConfig: JSON.stringify(data.scheduleConfig),
            goalLinks: data.goalLinks,
            systems: data.systems,
        }

        mutate(request, {
            onSuccess: () => {
                setStatus({ kind: "success", message: "Habito creado correctamente" })
                navigate(`/${appRoutes.HABITS.ROOT}`)
            },
            onError: (err) => {
                setStatus({
                    kind: "error",
                    message: err.message ?? "No se pudo crear el habito, intenta de nuevo",
                })
            },
        })
    }

    const onInvalid = (errors: FieldErrors<HabitFormValues>) => {
        console.log("[HabitForm] validation errors", errors)
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onValid, onInvalid)}>
                <FieldSet>
                    <Typography variant="h3">
                        {isEditing ? "Editar habito" : "Crear habito"}
                    </Typography>
                    <FieldGroup>
                        <FormField
                            name="name"
                            control={form.control}
                            label="Nombre"
                            placeholder="Mi habito"
                            type="text"
                        />
                        <EmojiPickerField
                            name="emoji"
                            control={form.control}
                            label="Emoji"
                        />
                    </FieldGroup>
                    <FormField
                        name="description"
                        control={form.control}
                        label="Descripcion"
                        placeholder="Descripcion del habito"
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
                        <Typography variant="p">Programacion</Typography>
                        <ScheduleInput control={form.control} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Typography variant="p">Sistemas vinculados</Typography>
                        <SystemsLinkingSection />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Typography variant="p">Metas vinculadas</Typography>
                        <GoalsLinkingSection />
                    </div>
                    <FormStatus state={status} />
                    <Button type="submit" disabled={isPending} isLoading={isPending}>
                        {isEditing ? "Guardar cambios" : "Crear habito"}
                    </Button>
                </FieldSet>
            </form>
        </FormProvider>
    )
}
