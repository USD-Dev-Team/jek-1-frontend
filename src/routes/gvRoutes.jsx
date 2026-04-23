
import DashboardGv from "../pages/GOVERENMENT/DashboardGv";
import Hodimlari from "../pages/GOVERENMENT/HodimlarGv";
import MurojatGv from "../pages/GOVERENMENT/MurojatGv";

import Problem from "../pages/JEK/Murojat/Problem";


const gvRoute = [
    // {
    //     name:"Dashboard",
    //     path:'',
    //     element:<Dashboard />
    // },
    {
        name:"Dashboard",
        path:'dashboard',
        element:<DashboardGv />
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
        path:'hodimlar',
        element:<Hodimlari />
    },
    
];
export default gvRoute