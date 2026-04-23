import Dashboard from "../pages/INSEKSIYA/Dashboard";
import Hodimlar from "../pages/INSEKSIYA/Hodimlar";
import Murojat from "../pages/INSEKSIYA/Murojat";
import Profile from "../pages/INSEKSIYA/Profile";
import JekProfile from "../pages/JEK/JekProfile/JekProfile";




const inRoute = [
    {
        name: "Hodimlar",
        path: 'hodim',
        element: <Hodimlar />
    },
    {
        name: "Dashboard",
        path: 'dashboard',
        element: <Dashboard />
    },
    {
        name: "Murojat",
        path: 'murojat',
        element: <Murojat />
    },
    {
        name: "Profile",
        path: "profile/:id",
        element: <Profile/>
    },
    {
        name: "MyProfile",
        path: "myprofile/:id",
        element: <JekProfile/>
    },

];
export default inRoute