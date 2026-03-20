import { useState, useMemo, type ReactNode } from 'react'
import { UiContext } from '@/contexts/UiContext'

interface UiContextProviderProps {
    children: ReactNode
}

export const UiContextProvider = ({children} : UiContextProviderProps) => {

    const [isSidebarOpened, setIsSidebarOpened] = useState(false)

    const value = useMemo(() => ({isSidebarOpened, setIsSidebarOpened}), [isSidebarOpened])

    return (
        <UiContext.Provider value={value}>
            {children}
        </UiContext.Provider>
    )
}