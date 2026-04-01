import { FormField } from "@/components/ui/form-field"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Typography } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { FieldSet, FieldGroup } from "@/components/ui/field"
import type { CreateProjectRequest } from "@/features/projects/types/request/create-project"
import { projectFormSchema, type ProjectFormSchema } from "@/features/projects/schemas/project-form-schema"
import { asProjectCodeString } from "@/features/projects/types/project-code-string"
import { asISODateString, asISOTimestampString } from "@/types/dates"

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
            // date input gives YYYY-MM-DD — append time and UTC offset to make a valid timestamp
            deadline: asISOTimestampString(`${data.deadline}T00:00:00.000Z`),
        }
        // call mutate(request) here
    }

    return (
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
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
                    <Typography variant="p">
                        {isEditing ? "Guardar cambios" : "Crear proyecto"}
                    </Typography>
                </Button>
            </FieldSet>
        </form>
    )
}
