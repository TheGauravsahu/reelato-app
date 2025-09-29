import { FoodPartnerRegisterForm } from "@/components/auth/foodPartner/foodPartner-register-form";

const RegisterFoodPartner = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background" >
      <div className="w-full max-w-sm">
        <FoodPartnerRegisterForm />
      </div>
    </div>
  );
};

export default RegisterFoodPartner;
