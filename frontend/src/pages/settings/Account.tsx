import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdateUserAccountFormSchema,
  type UpdateUserAccountFormData,
} from "@/types/auth";
import { useUpdateUser } from "@/hooks/useAuth";
import LoadingButton from "@/components/general/LoadingButton";
import { useUserAuthStore } from "@/hooks/useUserAuthStore";
import { useEffect } from "react";

const AccountPage = () => {
  const { isPending, mutate } = useUpdateUser();
  const { user } = useUserAuthStore();

  const form = useForm({
    resolver: zodResolver(UpdateUserAccountFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });

  function onSubmit(input: UpdateUserAccountFormData) {
    mutate(input);
  }

  useEffect(() => {
    form.reset({
      fullName: user?.fullName,
      email: user?.email,
    });
  }, [user?.email, user?.fullName, form]);

  return (
    <Card className="max-w-2xl border-none bg-background min-h-[65vh]">
      <CardHeader>
        <CardTitle className="text-2xl">Change Account Details</CardTitle>
        <CardDescription>Update your account information.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col gap-6">
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your full name"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter you email"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col gap-3">
                <LoadingButton
                  type="submit"
                  isPending={isPending}
                  loadingText="Saving"
                  className="w-full"
                >
                  Save
                </LoadingButton>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AccountPage;
