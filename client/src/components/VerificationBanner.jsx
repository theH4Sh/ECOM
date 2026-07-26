import { useSelector } from "react-redux";

export default function VerificationBanner() {
  const { isAuthenticated, isVerified } = useSelector((state) => state.auth);

  if (!isAuthenticated || isVerified) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 text-center text-sm text-amber-900">
      Please verify your email to place orders, leave reviews, and view order history.
      Check your inbox for the verification link.
    </div>
  );
}
