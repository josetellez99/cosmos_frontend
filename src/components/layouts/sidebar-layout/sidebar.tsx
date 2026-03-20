import { CloseButton } from "@/components/ui/close-button"
import { useUiContext } from "@/hooks/useUiContext";

export const Sidebar = () => {

  const { isSidebarOpened, setIsSidebarOpened } = useUiContext();

  if(!isSidebarOpened) return null

    return (
        <>
            <div className="fixed top-0 left-0 h-screen w-[90%] bg-white z-[70] shadow-2xl rounded-tr-[20px] rounded-br-[20px] flex flex-col p-4 pt-4 animate-in slide-in-from-left duration-500 ease-out max-w-sm">
                <div className="flex justify-end mb-4">
                    <CloseButton onClick={() => setIsSidebarOpened(false)} />
                </div>
                <div>
                    Hello world
                </div>
            </div>

             {/* Background overlay */} 
             <div
                className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[20] animate-in fade-in duration-300"
                onClick={() => setIsSidebarOpened(false)}
            />
        </>
    )
}