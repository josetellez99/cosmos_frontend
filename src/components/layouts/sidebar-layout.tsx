import { RootLayout } from "@/components/layouts/root-layout";
import type { ReactNode } from "react";
import { useUiContext } from "@/hooks/useUiContext";

interface props {
    children: ReactNode,
}

export const SidebarLayout = ({ children }: props) => {

    const { isSidebarOpened } = useUiContext()

    return (
        <RootLayout>
            <div className="flex">
                {children}
            </div>
        </RootLayout>
    );
};