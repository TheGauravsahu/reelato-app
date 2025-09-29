import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";

interface LogingButtonProps {
  onClick?: () => void;
  className?: string;
  isPending: boolean;
  loadingText: string;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
}

const LoadingButton = ({
  onClick,
  isPending,
  loadingText,
  children,
  type = "submit",
  className,
}: LogingButtonProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={isPending}
      type={type}
      className={cn("cursor-pointer", className)}
    >
      {isPending ? (
        <span>
          <Loader className="inline mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </span>
      ) : (
        <>{children}</>
      )}
    </Button>
  );
};

export default LoadingButton;
