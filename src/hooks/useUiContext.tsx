import { UiContext } from "@/contexts/UiContext";
import { useContext } from "react";

export const useUiContext = () => {

    const context = useContext(UiContext)
    if(!context) throw new Error('There is not possible to access to the ui context')
        
    const { 
        isSidebarOpened, 
        setIsSidebarOpened 
    } = context;

    return {
        isSidebarOpened,
        setIsSidebarOpened
    }
}