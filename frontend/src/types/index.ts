export interface IFood {
  _id: string;
  name: string;
  videoUrl: string;
  description: string;
  foodPartner: {
    _id: string;
    fullName: string;
  };
  likesCount: number;
  savesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IFoodWithFoodPartner {
  _id: string;
  name: string;
  videoUrl: string;
  description: string;
  foodPartner: {
    _id: string;
    fullName: string;
    phone: string;
    address: string;
  };
  likesCount: number;
  savesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IUser {
  _id: string;
  fullName: string;
  email: string;
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

export interface ILike {
  _id: string;
  foodId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISave {
  _id: string;
  foodId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IWatchHistory {
  _id: string;
  foodId: IFood;
  watchedAt: Date;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISavedHistory {
  _id: string;
  foodId: IFood;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ILikedHistory {
  _id: string;
  foodId: IFood;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPlaylist {
  _id: string;
  title: string;
  userId: string;
  foodIds: IFood[];
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IChat {
  _id: string;
  userId: string;
  foodPartnerId: string;
  lastMessage?: string;
  lastMessageAt?: Date;
  createdAt: string;
  updatedAt: string;
}

export interface IChatWithFoodPartner {
  _id: string;
  userId: string;
  foodPartnerId: {
    _id: string;
    fullName: string;
  };
  lastMessage?: string;
  lastMessageAt?: Date;
  createdAt: string;
  updatedAt: string;
}

export interface IMessage {
  _id: string;
  chatId: string;
  senderId: string;
  senderType: "user" | "food_partner";
  text: string;
  createdAt: string;
  updatedAt: string;
}
