import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";

const useAuth = () => {
  if (!useContext) {
    throw new Error("useContext is not defined");
  }
  return useContext(AuthContext);
};

export default useAuth;
