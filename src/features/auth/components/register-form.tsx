import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const RegisterForm = () => {
    return (
        <form className="max-w-sm w-full space-y-3" action="">
            <Input type="text" placeholder="Maria" />
            <Input type="text" placeholder="Rodriguez" />
            <Input type="date" placeholder="24-02-1990" />
            <Input type="email" placeholder="micorreo@dominio.com" />
            <Input type="password" placeholder="********" />
            <Input type="password" placeholder="********" />
            <Button type="submit" className="w-full">Registrarse</Button>
        </form>
    );
};