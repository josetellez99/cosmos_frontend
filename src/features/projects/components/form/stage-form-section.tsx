import { useState } from "react"
import { useFieldArray, useForm, useFormContext } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AddButton } from "@/components/ui/add-button"
import { Dialog, DialogContent, DialogHeader, DialogScrollArea, DialogTitle } from "@/components/ui/dialog"
import { Typography } from "@/components/ui/typography"
import { StageCard } from "@/features/projects/components/stage-card"
import { StageForm } from "@/features/projects/components/form/stage-form"
import { createStageSchema, type ProjectFormSchema, type StageFormSchema } from "@/features/projects/schemas/project-form-schema"
import { stageFormInitialValues } from "@/features/projects/constants/formsInitialValues"

export function StagesSection() {
    const form = useFormContext<ProjectFormSchema>()
    const { fields, append, update, remove } = useFieldArray({ control: form.control, name: "stages" })
    const [isOpen, setIsOpen] = useState(false)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)

    const draftForm = useForm<StageFormSchema>({
        resolver: zodResolver(createStageSchema),
    })

    const openAdd = () => {
        setEditingIndex(null)
        draftForm.reset(stageFormInitialValues)
        setIsOpen(true)
    }

    const openEdit = (index: number) => {
        setEditingIndex(index)
        draftForm.reset(fields[index])
        setIsOpen(true)
    }

    const handleSave = draftForm.handleSubmit((data) => {
        if (editingIndex !== null) {
            update(editingIndex, data)
        } else {
            append(data)
        }
        setIsOpen(false)
    })

    return (
        <div className="flex flex-col gap-2">
            <ul className="flex flex-col gap-2">
                {fields.map((stage, index) => (
                    <li key={stage.id}>
                        <StageCard
                            stage={stage}
                            index={index}
                            onEdit={openEdit}
                            onRemove={remove}
                        />
                    </li>
                ))}
            </ul>
            <AddButton text="Agregar etapa" onClick={openAdd} />
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            <Typography variant="p">
                                {editingIndex !== null ? "Editar etapa" : "Nueva etapa"}
                            </Typography>
                        </DialogTitle>
                    </DialogHeader>
                    <DialogScrollArea>
                        <StageForm
                            draftForm={draftForm}
                            onSave={handleSave}
                            isEditing={editingIndex !== null}
                        />
                    </DialogScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    )
}
