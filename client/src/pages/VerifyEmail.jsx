import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getErrorMessage } from "../lib/api";
import { setVerified } from "../slice/authSlice";

export default function VerifyEmail() {
  const { token } = useParams();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API}auth/verify/${token}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(getErrorMessage(data, "Verification failed"));
        }

        setMessage(data.message);
        setStatus("success");

        if (isAuthenticated) {
          dispatch(setVerified());
          const auth = JSON.parse(localStorage.getItem("auth"));
          if (auth) {
            localStorage.setItem(
              "auth",
              JSON.stringify({ ...auth, isVerified: true })
            );
          }
        }
      } catch (err) {
        setMessage(err.message || "Verification failed");
        setStatus("error");
      }
    };

    if (token) {
      verify();
    } else {
      setStatus("error");
      setMessage("Invalid verification link");
    }
  }, [token, isAuthenticated, dispatch]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="bg-slate-50 shadow-2xl rounded-2xl max-w-sm w-full md:w-96 p-8 space-y-6 text-center">
        {status === "loading" && (
          <>
            <h1 className="text-2xl font-semibold text-gray-800">Verifying email...</h1>
            <p className="text-gray-500">Please wait a moment.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600 text-2xl">
              ✓
            </div>
            <h1 className="text-2xl font-semibold text-gray-800">Email verified</h1>
            <p className="text-gray-600">{message}</p>
            <Link
              to={isAuthenticated ? "/" : "/login"}
              className="inline-block w-full py-2.5 rounded-lg bg-[#0B7C56] text-white font-semibold hover:bg-[#095c40] transition"
            >
              {isAuthenticated ? "Continue shopping" : "Go to login"}
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600 text-2xl">
              !
            </div>
            <h1 className="text-2xl font-semibold text-gray-800">Verification failed</h1>
            <p className="text-red-600">{message}</p>
            <Link
              to="/"
              className="inline-block w-full py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition"
            >
              Back to home
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
