import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold mb-4 text-primary">
        404 - Page Not Found
      </h1>
      <p className="text-lg text-muted-foreground">
        Oops! The page you are looking for does not exist.
      </p>
      <Link to="/" className={cn("mt-2", buttonVariants())}>
        Go back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
