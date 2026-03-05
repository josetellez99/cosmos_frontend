import { RootLayout } from "@/components/layouts/root-layout";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <RootLayout>
            <div className="flex flex-1 w-full justify-center items-center p-3">
                {children}
            </div>
        </RootLayout>
    );
};