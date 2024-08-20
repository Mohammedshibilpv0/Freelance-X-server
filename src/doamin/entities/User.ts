export interface IUser {
  firstName?: string;
  secondName?: string;
  _id?: string;
  email: string;
  password: string;
  phone?: number;
  refreshToken?: string;
  createAt?: Date;
  country?: string;
  skills?: string[];
  description?: string;
  profile?: string;
  isAdmin?: boolean;
  isBlock?: boolean;
  role?: string;
}



export interface IUserSummary {
  email: string;
  firstName: string;
  secondName: string;
  isBlock: boolean;
  country: string;
  createAt: Date;
}

export interface UserShortDetails {
  firstName: string;
  secondName: string;
  skills?: string[];
  createAt: Date;
  profile: string;
  description: string;
}
