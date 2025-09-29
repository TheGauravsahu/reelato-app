import { FoodPartnerLoginForm } from "@/components/auth/foodPartner/foodPartner-login-form";

const LoginFoodPartner = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-sm">
        <FoodPartnerLoginForm />
      </div>
    </div>
  );
};

export default LoginFoodPartner;
