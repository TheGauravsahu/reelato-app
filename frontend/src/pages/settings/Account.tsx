import DeleteAccount from "@/components/settings/DeleteAccount";
import UpdateAccountForm from "@/components/settings/UpdateAccountForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const AccountPage = () => {
  return (
    <Card className="max-w-2xl border-none  shadow-none bg-background min-h-[65vh]">
      <CardHeader>
        <CardTitle className="text-xl">Change Account Details</CardTitle>
        <CardDescription>Update your account information.</CardDescription>
      </CardHeader>
      <CardContent>
        <UpdateAccountForm />
        <DeleteAccount />
      </CardContent>
    </Card>
  );
};

export default AccountPage;
