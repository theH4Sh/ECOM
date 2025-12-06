import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const RootLayout = () => {
    return ( 
        <div>
            <nav>
                <Navbar/>
            </nav>
            <Outlet/>
        </div>
     );
}
 
export default RootLayout;