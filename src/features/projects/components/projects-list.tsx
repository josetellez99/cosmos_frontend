import { ProjectItem } from "@/features/projects/components/project-item";
import type { ProjectsSummary } from "@/features/projects/types/response/projects";
import { FallbackMessage } from "@/components/ui/messages/fallback-message";

interface props {
    projects: ProjectsSummary[]
    fallbackMessage: string
}

export const ProjectsList = ({projects, fallbackMessage}: props) => {

    if (projects.length === 0) {
        return (
            <div>
                <FallbackMessage>
                    {fallbackMessage}
                </FallbackMessage>
            </div>
        )
    }

    return (
        <ul className="flex flex-col spacing-in-list-elements">
            {projects.map((project) => (
                <li key={project.id}>
                    <ProjectItem project={project} />
                </li>
            ))}
        </ul>
    )
}