
import DashboardGv from "../pages/GOVERENMENT/DashboardGv";
import Hodimlari from "../pages/GOVERENMENT/HodimlarGv";
import MurojatGv from "../pages/GOVERENMENT/MurojatGv";
import Hodimlariinseksiya from "../pages/INSEKSIYA/HodimlarInseksiya";


import Problem from "../pages/JEK/Murojat/Problem";
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
    {
        name:"Murojat",
        path:'murojat',
        element:<MurojatGv />
    },


    {
        name:"Problem",
        path:'murojat/:id',
        element:<Problem role="gv" />
    },

    {
        name:"Jek Hodimlari",
        path:'jek/hodimlar',
        element:<Hodimlari />
    },
    {
        name:"Inseksiya Hodimlari",
        path:'inseksiya/hodimlar',
        element:<Hodimlariinseksiya />
    },
    // {
    //     name:"Jek Hodimlari",
    //     path:'hodimlar',
    //     element:<Hodimlar />
    // },

];
export default gvRoute