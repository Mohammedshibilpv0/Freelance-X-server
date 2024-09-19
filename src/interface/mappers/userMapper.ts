import { IUser } from "../../doamin/entities/User";

export const mapUserProfile = (user: IUser) => {
    return {
      _id: user?._id,
      role: user?.role,
      email: user?.email,
      phone: user?.phone,
      firstName: user?.firstName,
      secondName: user?.secondName,
      description: user?.description,
      skills: user?.skills,
      country: user?.country,
      profile: user?.profile,
    };
  };
  