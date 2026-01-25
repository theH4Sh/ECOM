import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const RootLayout = () => {
    return ( 
        <div>
            <nav>
                <Navbar/>
            </nav>
            <div className="min-h-screen">
                <Outlet/>
            </div>
            <Footer />
        </div>
     );
}
 
export default RootLayout;