import { useState } from "react"
import { FormProvider, useForm, type FieldErrors } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormField } from "@/components/ui/form-field"
import { Typography } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { FieldSet, FieldGroup } from "@/components/ui/field"
import { FormStatus, type FormStatusState } from "@/components/ui/form-status"
import type { CreateProjectRequest } from "@/features/projects/types/request/create-project"
import { projectFormSchema, type ProjectFormSchema } from "@/features/projects/schemas/project-form-schema"
import { asProjectCodeString } from "@/features/projects/types/project-code-string"
import { asISODateString, asISOTimestampString } from "@/types/dates"
import { StagesSection } from "@/features/projects/components/form/stage-form-section"
import { GoalsLinkingSection } from "@/features/goals/components/form/goals-linking-section"
import { ProjectFormPreview } from "@/features/projects/components/project-form-preview"
import { useCreateProject } from "@/features/projects/hooks/useCreateProject"

interface props {
    isEditing: boolean
    initialValues: ProjectFormSchema
}

export const ProjectForm = ({ isEditing, initialValues }: props) => {

    const { mutate, isPending } = useCreateProject()
    const [status, setStatus] = useState<FormStatusState>({ kind: "idle" })

    const form = useForm<ProjectFormSchema>({
        resolver: zodResolver(projectFormSchema),
        defaultValues: initialValues,
    })

    const onValid = (data: ProjectFormSchema) => {
        setStatus({ kind: "idle" })

        const request: CreateProjectRequest = {
            ...data,
            code: asProjectCodeString(data.code),
            startingDate: asISODateString(data.startingDate),
            deadline: asISOTimestampString(`${data.deadline}T00:00:00.000Z`),
        }

        mutate(request, {
            onSuccess: (created) => {
                console.log("[ProjectForm] success", created)
                setStatus({ kind: "success", message: "Proyecto creado correctamente" })
                if (!isEditing) form.reset(initialValues)
            },
            onError: (err) => {
                console.log("[ProjectForm] api error", err)
                setStatus({
                    kind: "error",
                    message: err.message ?? "No se pudo crear el proyecto",
                })
            },
        })
    }

    const onInvalid = (errors: FieldErrors<ProjectFormSchema>) => {
        console.log("[ProjectForm] validation errors", errors)
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onValid, onInvalid)}>
                <FieldSet>
                    <Typography variant="h3">
                        {isEditing ? "Editar proyecto" : "Crear proyecto"}
                    </Typography>
                    <FieldGroup>
                        <FormField
                            name="name"
                            control={form.control}
                            label="Nombre"
                            placeholder="Mi proyecto"
                            type="text"
                        />
                        <FormField
                            name="code"
                            control={form.control}
                            label="Código"
                            placeholder="AB-12"
                            type="text"
                        />
                    </FieldGroup>
                    <FieldGroup>
                        <FormField
                            name="startingDate"
                            control={form.control}
                            label="Fecha de inicio"
                            placeholder=""
                            type="date"
                        />
                        <FormField
                            name="deadline"
                            control={form.control}
                            label="Fecha límite"
                            placeholder=""
                            type="date"
                        />
                    </FieldGroup>
                    <div className="flex flex-col gap-2">
                        <Typography variant="p">Etapas</Typography>
                        <StagesSection />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Typography variant="p">Metas vinculadas</Typography>
                        <GoalsLinkingSection itemPreview={<ProjectFormPreview />} />
                    </div>
                    <FormStatus state={status} />
                    <Button type="submit" disabled={isPending} isLoading={isPending}>
                        {isEditing ? "Guardar cambios" : "Crear proyecto"}
                    </Button>
                </FieldSet>
            </form>
        </FormProvider>
    )
}
