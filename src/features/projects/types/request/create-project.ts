import type { Database } from "@/types/database.types";
import type { CreateTasksProjectsRequest } from "@/features/projects/types/request/create-projects-tasks";
import type { CreateProjectStageRequest } from "@/features/projects/types/request/create-projects-stages";
import type { GoalsLinkProjects } from "@/features/goals/types/conections/goals-projects";
import type { ISODateString, ISOTimestampString } from "@/types/dates"
import type { ProjectCodeString } from "@/features/projects/types/project-code-string";

export interface CreateProjectRequest {
    name: string;
    description: string,
    code: ProjectCodeString;
    startingDate: ISODateString
    deadline: ISOTimestampString
    status?: Database["public"]["Enums"]["item_status_type"][];
    stages: CreateProjectStageRequest[];
    tasks: CreateTasksProjectsRequest[];
    goalLink: GoalsLinkProjects[]
}



