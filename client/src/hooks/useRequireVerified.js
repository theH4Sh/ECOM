import { useSelector } from "react-redux";
import toast from "react-hot-toast";

export const useRequireVerified = () => {
  const { isAuthenticated, isVerified } = useSelector((state) => state.auth);

  const requireVerified = (action = "continue") => {
    if (!isAuthenticated) {
      toast.error("Please log in first");
      return false;
    }

    if (!isVerified) {
      toast.error(`Please verify your email to ${action}`);
      return false;
    }

    return true;
  };

  return { isAuthenticated, isVerified, requireVerified };
};
