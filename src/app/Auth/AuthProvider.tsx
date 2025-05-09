"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../firebase/firebase";
interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  logOut: () => Promise<void>;
}
const AuthContext = createContext<AuthContextProps>({
  user: null,
  isLoading: true,
  logOut: async () => {},
});
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
