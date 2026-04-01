import { ProjectForm } from "@/features/projects/components/project-form"
import type { CreateProjectRequest } from "@/features/projects/types/request/create-project"

export const CreateProjectPage = () => {

    const initialvalues: CreateProjectRequest = {
        name: '',
        description: '',
        code: '',
        startingDate: '',
        deadline: '',
        status: [],
        stages: [],
        tasks: [],
        goalLink: []
    }

    return(
        <>
            <ProjectForm 
                initialValues={initialvalues}
                isEditing={false}
            />
        </>
    )
}