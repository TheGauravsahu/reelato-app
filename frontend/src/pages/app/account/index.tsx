import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UpdateFoodPartner from "./UpdateFoodPartner";
import DeleteFoodPartnerAccount from "./DeleteFoodPartnerAccount";

const FoodPartnerAccountPage = () => {
  return (
    <Card className="max-w-2xl border-none  shadow-none bg-background min-h-[65vh]">
      <CardHeader>
        <CardTitle className="text-xl">Change Account Details</CardTitle>
        <CardDescription>Update your account information.</CardDescription>
      </CardHeader>
      <CardContent>
        <UpdateFoodPartner />
        <DeleteFoodPartnerAccount />
      </CardContent>
    </Card>
  );
};

export default FoodPartnerAccountPage;
