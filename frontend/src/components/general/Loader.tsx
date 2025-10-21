import { Loader2 } from "lucide-react";

const 
Loader = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Loader2 className="animate-spin" />
    </div>
  );
};

export default Loader;
