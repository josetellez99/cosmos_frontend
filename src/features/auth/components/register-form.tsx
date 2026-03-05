import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const RegisterForm = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <form className="max-w-sm" action="">
                <Input type="text" placeholder="Username" />
                <Input type="email" placeholder="Email" />
                <Input type="password" placeholder="Password" />
                <Button type="submit">Register</Button>
            </form>
        </div>
    );
};