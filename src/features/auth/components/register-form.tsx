import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const RegisterForm = () => {
    return (
        <form className="max-w-sm w-full space-y-4" action="">
            <Input type="text" placeholder="Username" />
            <Input type="email" placeholder="Email" />
            <Input type="password" placeholder="Password" />
            <Button type="submit" className="w-full">Register</Button>
        </form>
    );
};