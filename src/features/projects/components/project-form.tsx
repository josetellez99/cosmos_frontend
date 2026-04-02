import { FormField } from "@/components/ui/form-field"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Typography } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { FieldSet, FieldGroup } from "@/components/ui/field"
import type { CreateProjectRequest } from "@/features/projects/types/request/create-project"
import { projectFormSchema, type ProjectFormSchema, type StageFormValues, type TaskFormValues } from "@/features/projects/schemas/project-form-schema"
import { asProjectCodeString } from "@/features/projects/types/project-code-string"
import { asISODateString, asISOTimestampString } from "@/types/dates"
import { StagesFormSection } from "@/features/projects/components/stage-form-section"
import { TaskFormModal } from "@/features/projects/components/task-form-modal"
import { GoalLinkModal } from "@/features/projects/components/goal-link-modal"
import { z } from "zod"
import { goalLinkProjectSchema } from "@/features/goals/schemas/goal-link-project-schema"

type GoalLinkValues = z.infer<typeof goalLinkProjectSchema>

interface props {
    isEditing: boolean
    initialValues: ProjectFormSchema
}

export const ProjectForm = ({ isEditing, initialValues }: props) => {

    const form = useForm<ProjectFormSchema>({
        resolver: zodResolver(projectFormSchema),
        defaultValues: initialValues,
    })

    const { fields: stageFields, append: appendStage, update: updateStage, remove: removeStage } = useFieldArray({ control: form.control, name: 'stages' })
    const { fields: taskFields, append: appendTask, update: updateTask, remove: removeTask } = useFieldArray({ control: form.control, name: 'tasks' })
    const { fields: goalLinkFields, append: appendGoalLink, remove: removeGoalLink } = useFieldArray({ control: form.control, name: 'goalLink' })

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
                <div className="flex flex-col spacing-in-list-elements">
                    <Typography variant="p">Etapas</Typography>
                    <StagesFormSection
                        stages={stageFields as StageFormValues[]}
                        onAdd={appendStage}
                        onEdit={(i, d) => updateStage(i, d)}
                        onRemove={removeStage}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Typography variant="p">Tareas</Typography>
                    <TaskFormModal
                        tasks={taskFields as TaskFormValues[]}
                        onAdd={appendTask}
                        onEdit={(i, d) => updateTask(i, d)}
                        onRemove={removeTask}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Typography variant="p">Metas vinculadas</Typography>
                    <GoalLinkModal
                        goalLinks={goalLinkFields as GoalLinkValues[]}
                        onAdd={appendGoalLink}
                        onRemove={removeGoalLink}
                    />
                </div>
                <Button type="submit" disabled={form.formState.isSubmitting} isLoading={form.formState.isSubmitting}>
                    {isEditing ? "Guardar cambios" : "Crear proyecto"}
                </Button>
            </FieldSet>
        </form>
    )
}
