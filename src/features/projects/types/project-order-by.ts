export const ProjectsOrderBy = {
    NAME: "name",
    CREATED_AT: "created_at",
    DEADLINE: "deadline",
    STARTING_DATE: "starting_date",
    STATUS: "status",
    SORT_ORDER: "sort_order",
} as const

export type ProjecstOrderBy = typeof ProjectsOrderBy[keyof typeof ProjectsOrderBy]