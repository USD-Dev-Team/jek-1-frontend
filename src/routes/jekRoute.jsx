
import Dashboard from "../pages/JEK/Dashboard/Dashboard";

import Murojat from "../pages/JEK/Murojat/Murojat";
import Problem from "../pages/JEK/Murojat/Problem";



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
    {
        name:"Problem",
        path:`murojat/:id`,
        element:<Problem />
    },
    
];
export default jekRoute