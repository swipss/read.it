import { User, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import AuthContext, { TUserData } from "./AuhtContext";
import db, { auth } from "./firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<TUserData | null>(null);
  useEffect(() => {
    onAuthStateChanged(auth, async (authUser) => {
      console.log("auth state changed");
      const userRef = doc(db, "users", String(authUser?.uid));
      onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          setUserData(doc.data() as TUserData);
        }
      });
      setUser(authUser);
      // const userDoc = await getDoc(userRef);
      // console.log(userDoc.data());
      // setUser(authUser);
      // setUserData(userDoc.data() as TUserData);
    });
  }, []);
  return (
    <AuthContext.Provider value={{ user, userData }}>
      {children}
    </AuthContext.Provider>
  );
};
