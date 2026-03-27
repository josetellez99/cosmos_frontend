import { useProjects } from "@/features/projects/hooks/useProjects"

export const ProjectsPage = () => {

    const { projects, isLoading } = useProjects({})

    console.log(projects)
    console.log(isLoading)

    return (
        <>Hello projects</>
    )
}