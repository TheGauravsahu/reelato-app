export interface IFood {
  _id: string;
  name: string;
  videoUrl: string;
  description: string;
  foodPartner: {
    _id: string;
    fullName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IUser {
  _id: string;
  fullName: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export interface IFoodPartner {
  _id: string;
  fullName: string;
  contactName: string;
  phone: string;
  address: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}
