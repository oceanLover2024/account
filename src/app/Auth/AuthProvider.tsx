"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../firebase/firebase";
interface AuthContextProps {
  isLoading: boolean;
  user: User | null;
  logOut: () => Promise<void>;
}
const AuthContext = createContext<AuthContextProps>({
  user: null,
  isLoading: true,
  logOut: async () => {},
});
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);
  const logOut = async () => await signOut(auth);
  return (
    <>
      <AuthContext.Provider value={{ user, isLoading, logOut }}>
        {children}
      </AuthContext.Provider>
    </>
  );
}
export const useAuth = () => useContext(AuthContext);
