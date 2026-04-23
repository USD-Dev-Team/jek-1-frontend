
import DashboardGv from "../pages/GOVERENMENT/DashboardGv";
import JekProfile from "../pages/JEK/JekProfile/JekProfile";

const gvRoute = [
    // {
    //     name:"Dashboard",
    //     path:'',
    //     element:<Dashboard />
    // },
    {
        name: "Dashboard",
        path: 'dashboard',
        element: <DashboardGv />
    },
    {
        name: "Profile",
        path: "profile/:id",
        element: <JekProfile />
    },
    // {
    //     name:"Jek Hodimlari",
    //     path:'hodimlar',
    //     element:<Hodimlar />
    // },

];
export default gvRoute