import { createContext, type Dispatch, type SetStateAction } from "react";

export interface UiContextType {
    isSidebarOpened: boolean
    setIsSidebarOpened: Dispatch<SetStateAction<boolean>>
}

export const UiContext = createContext<UiContextType | undefined>(undefined);