import { Button } from "@/components/ui/button";
import { Menu } from 'lucide-react'
import { useUiContext } from "@/hooks/useUiContext";

export const HambugerButton = () => {

    const { setIsSidebarOpened } = useUiContext()

    const onClick = () => {
        setIsSidebarOpened(true)
    }

    return (
        <Button 
            size="icon"
            className="rounded-full"
            onClick={onClick}
        >
            <Menu />
        </Button>
    )
}