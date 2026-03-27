import { X } from "lucide-react";
import { cn } from "@/helpers/cn-tailwind";

interface CloseButtonProps {
  onClick: () => void;
  className?: string;
  size?: number;
}

export const CloseButton = ({
  onClick,
  className,
  size = 18,
}: CloseButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-2 hover:bg-primary/10 rounded-full transition-colors duration-200 cursor-pointer",
        className
      )}
      aria-label="Close"
    >
      <X size={size} className="text-primary/80" />
    </button>
  );
};
