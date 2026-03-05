import { RootLayout } from "@/components/layouts/root-layout";

export const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <RootLayout>
            <div className="flex">
                {children}
            </div>
        </RootLayout>
    );
};