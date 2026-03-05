import { RootLayout } from "@/components/layouts/root-layout";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <RootLayout>
            <div className="flex justify-center items-center">
                {children}
            </div>
        </RootLayout>
    );
};