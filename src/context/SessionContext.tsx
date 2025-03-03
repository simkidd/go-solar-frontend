import { useAuthStore } from "@/lib/stores/auth.store";
import { USER_DETAILS } from "@/utils/constants";
import Cookies from "js-cookie";
import { createContext, ReactNode, useContext, useEffect } from "react";
import { SignUpInput, User } from "../interfaces/auth.interface";

interface SessionContextType {
  user: User | undefined;
  loading: boolean;
  logout: () => void;
  signup: (input: SignUpInput) => Promise<void>;
  setUser: (user: User) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading, logout, signup, setUser } = useAuthStore();

  // Initialize user from cookies on mount
  useEffect(() => {
    const userCookie = Cookies.get(USER_DETAILS);
    if (userCookie) {
      const parsedUser = JSON.parse(userCookie) as User;
      setUser(parsedUser);
    }
  }, [setUser]);

  return (
    <SessionContext.Provider
      value={{
        user,
        loading,
        logout,
        signup,
        setUser,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
