import { RootLayout } from "@/components/layouts/root-layout";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <RootLayout>
            <div className="h-full w-full flex justify-center items-center p-3">
                {children}
            </div>
        </RootLayout>
    );
};