import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormField } from "@/components/ui/form-field"
import { Typography } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { FieldSet, FieldGroup } from "@/components/ui/field"
import type { CreateProjectRequest } from "@/features/projects/types/request/create-project"
import { projectFormSchema, type ProjectFormSchema } from "@/features/projects/schemas/project-form-schema"
import { asProjectCodeString } from "@/features/projects/types/project-code-string"
import { asISODateString, asISOTimestampString } from "@/types/dates"
import { StagesSection } from "@/features/projects/components/form/stage-form-section"
import { GoalsLinkingSection } from "@/features/goals/components/form/goals-linking-section"

interface props {
    isEditing: boolean
    initialValues: ProjectFormSchema
}

export const ProjectForm = ({ isEditing, initialValues }: props) => {

    const form = useForm<ProjectFormSchema>({
        resolver: zodResolver(projectFormSchema),
        defaultValues: initialValues,
    })

    const onSubmit = (data: ProjectFormSchema) => {
        const request: CreateProjectRequest = {
            ...data,
            code: asProjectCodeString(data.code),
            startingDate: asISODateString(data.startingDate),
            deadline: asISOTimestampString(`${data.deadline}T00:00:00.000Z`),
        }

        console.log(request)
        // call mutate(request) here
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
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
                        <GoalsLinkingSection />
                    </div>
                    <Button type="submit" disabled={form.formState.isSubmitting} isLoading={form.formState.isSubmitting}>
                        {isEditing ? "Guardar cambios" : "Crear proyecto"}
                    </Button>
                </FieldSet>
            </form>
        </FormProvider>
    )
}
