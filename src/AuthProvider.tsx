import { User, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import AuthContext, { IUserData } from "./AuhtContext";
import db, { auth } from "./firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<IUserData | null>(null);
  useEffect(() => {
    onAuthStateChanged(auth, async (authUser) => {
      console.log("auth state changed");
      const userRef = doc(db, "users", String(authUser?.uid));
      onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          setUserData(doc.data() as IUserData);
        }
      });
      setUser(authUser);
      // const userDoc = await getDoc(userRef);
      // console.log(userDoc.data());
      // setUser(authUser);
      // setUserData(userDoc.data() as IUserData);
    });
  }, []);
  return (
    <AuthContext.Provider value={{ user, userData }}>
      {children}
    </AuthContext.Provider>
  );
};
