import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { logout } from "../slice/authSlice";

const Navbar = () => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const username = useSelector((state) => state.auth.username);
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);
    const dropdownRef =  useRef();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, []);

    const handleLogout = () => {
        dispatch(logout())
        localStorage.removeItem("auth")
        setOpen(false);
    };

    return ( 
        <div className="flex items-center justify-between p-4 border-b-3 border-gray-100 mb-6">
            <div>
                <h1 className="text-2xl font-extrabold text-[#0B7C56]">Shopz</h1>
            </div>

            <div className="flex items-center gap-6">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                </div>
                {isAuthenticated ? (
                    <div ref={dropdownRef} className="relative">
                        <div
                            onClick={() => setOpen(!open)} 
                            className="flex justify-center items-center cursor-pointer"
                        >
                            <div className="text-sm">{username}</div>
                            <div className="bg-[#0B7C56] text-white font-semibold px-5 py-3 rounded-4xl mx-1 text-lg">{username.charAt(0).toUpperCase()}</div>
                        </div>

                        {open && (
                            <div
                                className="absolute right-0 mt-5 w-48 bg-white shadow-xl rounded-xl
                                border border-gray-200 py-2 transition-all duration-300 animate-fadeIn"
                            >
                                {/* Profile */}
                                <div
                                className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 hover:bg-gray-100"
                                >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                    viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                    className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 
                                    3.75 3.75 0 0 1 7.5 0ZM4.501 
                                    20.118a7.5 7.5 0 0 1 14.998 
                                    0A17.933 17.933 0 0 1 12 
                                    21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                </svg>
                                <p>{username}</p>
                                </div>

                                {/* Orders */}
                                <Link
                                to="/orders"
                                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-sm"
                                onClick={() => setOpen(false)}
                                >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                    viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                    className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 
                                    0 9 9 0 0 1 18 0Z" />
                                </svg>
                                <p>Order History</p>
                                </Link>

                                {/* Logout */}
                                <button
                                onClick={handleLogout}
                                className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm text-red-600 flex items-center gap-2"
                                >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                    viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                    className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M8.25 9V5.25A2.25 2.25 0 0 1 
                                    10.5 3h6a2.25 2.25 0 0 1 2.25 
                                    2.25v13.5A2.25 2.25 0 0 1 
                                    16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 
                                    0-3-3m0 0 3-3m-3 3H15" />
                                </svg>
                                <p>Logout</p>
                                </button>
                            </div>
                            )}
                    </div>
                ) : (
                    <Link to="/login">
                        <div className="bg-[#0B7C56] text-white px-4 py-2 rounded-md">Login</div>
                    </Link>
                )}
            </div>
        </div>
     );
}
 
export default Navbar;