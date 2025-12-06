import { Link } from "react-router";

const Navbar = () => {
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
                <Link to="/login">
                    <div className="bg-[#0B7C56] text-white px-4 py-2 rounded-md">Login</div>
                </Link>
            </div>
        </div>
     );
}
 
export default Navbar;