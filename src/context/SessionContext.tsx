import { useAuthStore } from "@/lib/stores/auth.store";
import { USER_DETAILS } from "@/utils/constants";
import Cookies from "js-cookie";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "../interfaces/auth.interface";
import { useRouter } from "next/navigation";

interface SessionContextType {
  loading: boolean;
  user: User | undefined;
  logout: () => void;
  setUser: (user: User) => void;
  isAuthenticated: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

const userCookie = Cookies.get(USER_DETAILS);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const {
    user,
    logout: storeLogout,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
  } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize user from cookies on mount
  useEffect(() => {
    if (userCookie) {
      const parsedUser = JSON.parse(userCookie) as User;
      setUser(parsedUser);
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, [setUser, setIsAuthenticated]);

  const logout = () => {
    router.push("/account/login"); // Redirect to login page after logout
    storeLogout();
  };

  return (
    <SessionContext.Provider
      value={{
        loading,
        user,
        logout,
        setUser,
        isAuthenticated,
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
