import { useState, useMemo, type ReactNode } from 'react'
import { UiContext } from '@/contexts/UiContext'
import { formatDateForApi } from '@/features/habits/helpers/format-date-for-api'

interface UiContextProviderProps {
    children: ReactNode
}

export const UiContextProvider = ({children} : UiContextProviderProps) => {

    const [isSidebarOpened, setIsSidebarOpened] = useState(false)
    const [dashboardDate, setDashboardDate] = useState(() => formatDateForApi(new Date()))

    const value = useMemo(
        () => ({ isSidebarOpened, setIsSidebarOpened, dashboardDate, setDashboardDate }),
        [isSidebarOpened, dashboardDate]
    )

    return (
        <UiContext.Provider value={value}>
            {children}
        </UiContext.Provider>
    )
}