import { HabitForm } from "@/features/habits/components/habit-form"
import { habitFormInitialValues } from "@/features/habits/constants/formsInitialValues"

export const CreateHabitPage = () => {
    return (
        <HabitForm
            initialValues={habitFormInitialValues}
            isEditing={false}
        />
    )
}
