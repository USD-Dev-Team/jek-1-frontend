import Dashboard from "../pages/JEK/Dashboard/Dashboard";

import Murojat from "../pages/JEK/Murojat/Murojat";


const jekRoute = [
    // {
    //     name:"home",
    //     path:'',
    //     element:<Home />
    // },
    {
        name:"Dashboard",
        path:'dashboard',
        element:<Dashboard />
    },
    {
        name:"Murojat",
        path:'murojat',
        element:<Murojat />
    },
    
];
export default jekRoute