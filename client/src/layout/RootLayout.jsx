import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import Breadcrumbs from "../components/Breadcrumbs";

const RootLayout = () => {
    return ( 
        <div>
            <ScrollToTop />
            <nav>
                <Navbar/>
            </nav>
            <div className="min-h-screen">
                <Breadcrumbs />
                <Outlet/>
            </div>
            <Footer />
        </div>
     );
}
 
export default RootLayout;