import { useSearchParams } from "react-router";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useEffect } from "react";

export const VerifyEmailPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const type = searchParams.get("type");
    const { verifyEmail } = useAuth();

    useEffect(() => {
        const init = async () => {
            if (token && type) {
                const res = await verifyEmail({ tokenHash: token, type })
                console.log(res)
            }
        }
        init()
    }, [token, type])

    return (
        <div>
            <h1>Verify Email</h1>
            <p>Token: {token}</p>
            <p>Type: {type}</p>
        </div>
    );
};