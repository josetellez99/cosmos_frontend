import { LoginForm } from "@/features/auth/components/login-form";
import { AuthLayout } from "@/components/layouts/auth-layout";

export const LoginPage = () => {
    return (
        <AuthLayout>
            <LoginForm />
        </AuthLayout>
    );
};
