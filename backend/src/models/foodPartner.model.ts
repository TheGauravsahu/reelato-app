import mongoose from "mongoose";

export interface IFoodPartner extends mongoose.Document {
  fullName: string;
  contactName: string;
  phone:string;
  address: string;
  email: string;
  password: string;
}

const foodPartnerSchema = new mongoose.Schema<IFoodPartner>(
  {
    fullName: {
      type: String,
      required: true,
    },
    contactName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);

export const foodPartnerModel = mongoose.model<IFoodPartner>(
  "food_partners",
  foodPartnerSchema
);
