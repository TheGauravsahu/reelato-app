import { ModeToggle } from "@/components/general/mode-toggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PrefrencesPage = () => {
  return (
    <Card className="max-w-2xl border-none shadow-none bg-background min-h-[65vh]">
      <CardHeader>
        <CardTitle className="text-2xl">Preferences</CardTitle>
        <CardDescription>Change prefrences settings.</CardDescription>
      </CardHeader>
      <CardContent>
        <ModeToggle />
      </CardContent>
    </Card>
  );
};

export default PrefrencesPage;
