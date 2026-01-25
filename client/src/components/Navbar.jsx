import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { logout } from "../slice/authSlice";
import CartDrawer from "./CartDrawer";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const role = useSelector((state) => state.auth.role)
    const username = useSelector((state) => state.auth.username);
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);
    const dropdownRef =  useRef();
    
    const [showCart, setShowCart] = useState(false);

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
                {/* Notification Bell */}
                <NotificationBell />
                
                {/* Cart */}
                <div onClick={() => setShowCart(!showCart)}
                    className="cursor-pointer"
                >
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

                                {/* Admin Panel */}
                                {role == "admin" && (
                                    <Link to='/admin'>
                                        <div className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            </svg>
                                            <p>Admin</p>
                                        </div>
                                    </Link>
                                )}

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

            {/* Cart Drawer */}
            <CartDrawer open={showCart} onClose={() => setShowCart(false)} />
        </div>
     );
}
 
export default Navbar;