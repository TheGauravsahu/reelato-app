import { UserRegisterForm } from "@/components/auth/user/user-register-form";

const RegisterUser = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-sm">
        <UserRegisterForm />
      </div>
    </div>
  );
};

export default RegisterUser;
