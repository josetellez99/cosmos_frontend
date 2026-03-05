import { RegisterForm } from "@/features/auth/components/register-form";
import { AuthLayout } from "@/components/layouts/auth-layout";

export const RegisterPage = () => {
    return (
        <AuthLayout>
            <RegisterForm />
        </AuthLayout>
    );
};