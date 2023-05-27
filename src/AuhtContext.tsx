import { User } from "firebase/auth";
import React, { createContext } from "react";
export interface IUserData {
  email: string;
  uid: string;
  name: string;
  bio: string;
  imageUrl: string;
  coverImageUrl: string;
}
const AuthContext = createContext({
  user: null as User | null,
  userData: null as IUserData | null,
});

export default AuthContext;
