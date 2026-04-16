import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { CloseButton } from "@/components/ui/close-button"
import { Typography } from "@/components/ui/typography";
import { useUiContext } from "@/hooks/useUiContext";
import { appRoutes } from "@/lib/constants/routes";

const NAV_LINKS = [
    { to: `/${appRoutes.PROJECTS.ROOT}`, label: 'Proyectos' },
    { to: `/${appRoutes.HABITS.ROOT}`, label: 'Hábitos' },
    { to: `/${appRoutes.GOALS.ROOT}`, label: 'Metas' },
    { to: `/${appRoutes.SYSTEMS.ROOT}`, label: 'Sistemas' },
] as const

export const Sidebar = () => {

  const { isSidebarOpened, setIsSidebarOpened } = useUiContext();

  if(!isSidebarOpened) return null

    return (
        <>
            <div className="fixed top-0 left-0 h-screen w-[90%] bg-white z-[70] shadow-2xl rounded-tr-[20px] rounded-br-[20px] flex flex-col p-4 pt-4 animate-in slide-in-from-left duration-500 ease-out max-w-sm">
                <div className="flex justify-end mb-4">
                    <CloseButton onClick={() => setIsSidebarOpened(false)} />
                </div>
                <nav className="flex flex-col">
                    {NAV_LINKS.map(({ to, label }) => (
                        <Link
                            key={to}
                            to={to}
                            onClick={() => setIsSidebarOpened(false)}
                            className="flex items-center justify-between py-3 px-2 cursor-pointer text-primary hover:opacity-70 transition-opacity"
                        >
                            <Typography className="font-medium">{label}</Typography>
                            <ChevronRight className="size-4" />
                        </Link>
                    ))}
                </nav>
            </div>

             {/* Background overlay */}
             <div
                className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[20] animate-in fade-in duration-300"
                onClick={() => setIsSidebarOpened(false)}
            />
        </>
    )
}