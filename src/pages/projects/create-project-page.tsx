import { ProjectForm } from "@/features/projects/components/project-form"
import { projectFormInitialValues } from "@/features/projects/constants/formsInitialValues"

// TODO: You can add an special layout for pages form

export const CreateProjectPage = () => {

    return(
        <ProjectForm
            initialValues={projectFormInitialValues}
            isEditing={false}
        />
    )
}