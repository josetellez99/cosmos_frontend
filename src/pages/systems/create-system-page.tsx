import { SystemForm } from "@/features/systems/components/system-form"
import { systemFormInitialValues } from "@/features/systems/constants/formsInitialValues"

export const CreateSystemPage = () => {
    return (
        <SystemForm
            initialValues={systemFormInitialValues}
            isEditing={false}
        />
    )
}
