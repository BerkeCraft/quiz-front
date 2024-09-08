import { createContext, useState } from "react";

interface User {
  name: string;
  id: number;
  email: string;
}
interface AuthContextType {
  auth: {
    user: User | null;
    isAuthenticated: boolean;
  } | null;
  signin: (user: User, callback?: VoidFunction) => void;
  signout: (callback?: VoidFunction) => void;
}
const AuthContext = createContext<AuthContextType>(null!);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<{
    user: User | null;
    isAuthenticated: boolean;
  } | null>(null);

  const signin = (user: User, callback?: VoidFunction) => {
    if (user) {
      setAuth({ user: user, isAuthenticated: true });
    } else {
      throw new Error("User is not defined");
    }
    if (callback) {
      callback();
    }
  };

  const signout = (callback?: VoidFunction) => {
    localStorage.removeItem("accessToken");
    setAuth({
      user: null,
      isAuthenticated: false,
    });
    if (callback) callback();
  };
  return (
    <AuthContext.Provider value={{ auth, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
AuthContext.displayName = "AuthContext";
