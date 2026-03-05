export const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen w-screen">
            {children}
        </div>
    );
};