export interface SystemDetailHabit {
    habitSystemId: number
    id: number
    name: string
    emoji: string
    scheduleType: string
    scheduleConfig: { days: number | number[] }
    habitWeight: number
    habitOrder: number
    progress: number
}

export interface SystemDetailGoal {
    id: number
    name: string
    progress: number
}

export interface SystemDetailResponse {
    id: number
    name: string
    symbol: string | null
    startingDate: string
    progress: number
    habits: SystemDetailHabit[]
    goals: SystemDetailGoal[]
    createdAt: string
    modifiedAt: string
}
