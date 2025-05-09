"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../firebase/firebase";
interface AuthContextProps {
  user: User | null;
  logOut: () => Promise<void>;
}
const AuthContext = createContext<AuthContextProps>({
  user: null,
  logOut: async () => {},
});
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);
  const logOut = async () => await signOut(auth);
  return (
    <>
      <AuthContext.Provider value={{ user, logOut }}>
        {children}
      </AuthContext.Provider>
    </>
  );
}
export const useAuth = () => useContext(AuthContext);
