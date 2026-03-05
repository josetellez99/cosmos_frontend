import { useSearchParams } from "react-router";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export const VerifyEmailPage = () => {

    const { verifyEmail } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const type = searchParams.get("type");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true)
                if (token && type) {
                    const response = await verifyEmail({ tokenHash: token, type })
                    if (response.ok) navigate("/login")
                }
            } catch (e: unknown) {
                if (e instanceof Error) {
                    setError(e.message)
                }
            } finally {
                setLoading(false)
            }
        }
        init()
    }, [token, type])

    return (
        <div>
            {loading && <p>Verificando...</p>}
            {error && <p>{error}</p>}
        </div>
    );
};