import type { Database } from "@/types/database.types";
import type { CreateProjectStageRequest } from "@/features/projects/types/request/create-projects-stages";
import type { GoalSubitemConnection } from "@/features/goals/types/conections/goal-subitem";
import type { ISODateString, ISOTimestampString } from "@/types/dates"
import type { ProjectCodeString } from "@/features/projects/types/project-code-string";

export interface CreateProjectRequest {
    name: string;
    description?: string,
    code: ProjectCodeString;
    startingDate: ISODateString
    deadline: ISOTimestampString
    status?: Database["public"]["Enums"]["item_status_type"] | null;
    stages?: CreateProjectStageRequest[];
    goalLinks?: GoalSubitemConnection[]
}



