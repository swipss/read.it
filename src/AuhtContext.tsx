import { User } from "firebase/auth";
import { createContext } from "react";
export type TUserData = {
  email: string;
  uid: string;
  name: string;
  bio: string;
  imageUrl: string;
  coverImageUrl: string;
  following: string[];
};
const AuthContext = createContext({
  user: null as User | null,
  userData: null as TUserData | null,
});

export default AuthContext;
