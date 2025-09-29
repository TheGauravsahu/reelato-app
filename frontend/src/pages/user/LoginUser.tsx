import { UserLoginForm } from "@/components/auth/user/user-login-form";

const LoginUser = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-sm">
        <UserLoginForm />
      </div>
    </div>
  );
};

export default LoginUser;
