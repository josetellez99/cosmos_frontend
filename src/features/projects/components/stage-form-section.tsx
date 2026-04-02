import { useState } from "react";
import { AddButton } from "@/components/ui/add-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogScrollArea,
  DialogTitle,
} from "@/components/ui/dialog";
import { Typography } from "@/components/ui/typography";
import { StageForm } from "@/features/projects/components/stage-form";
import type { StageFormSchema } from "@/features/projects/schemas/project-form-schema";
import { StageCard } from "@/features/projects/components/stage-card";
import { stageFormInitialValues } from "@/features/projects/constants/formsInitialValues";

interface StageFormModalProps {
  stages: StageFormSchema[];
  onAdd: (data: StageFormSchema) => void;
  onEdit: (index: number, data: StageFormSchema) => void;
  onRemove: (index: number) => void;
}

export function StagesFormSection({
  stages,
  onAdd,
  onEdit,
  onRemove,
}: StageFormModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const openAdd = () => {
    setEditingIndex(null);
    setIsOpen(true);
  };

  const openEdit = (index: number) => {
    setEditingIndex(index);
    setIsOpen(true);
  };

  const handleSubmit = (data: StageFormSchema) => {
    if (editingIndex !== null) {
      onEdit(editingIndex, data);
    } else {
      onAdd(data);
    }
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-2">

    {/* Rendering the current stages added */}
      <ul className="flex flex-col gap-2">
        {stages.map((stage, index) => (
          <li key={index}>
            <StageCard
              stage={stage}
              index={index}
              onEdit={openEdit}
              onRemove={onRemove}
            />
          </li>
        ))}
      </ul>

      {/* Button that add the stage */}
      <AddButton text="Agregar etapa" onClick={openAdd} />

      {/* Modal */}
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
              key={editingIndex ?? "new"}
              isEditing={editingIndex !== null}
              initialValues={
                editingIndex !== null ? stages[editingIndex] : stageFormInitialValues
              }
              onSubmit={handleSubmit}
            />
          </DialogScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
