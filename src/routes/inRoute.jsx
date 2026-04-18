import Dashboard from "../pages/INSEKSIYA/Dashboard";
import Hodimlar from "../pages/INSEKSIYA/Hodimlar";
import Murojat from "../pages/INSEKSIYA/Murojat";




const inRoute = [
    {
        name:"Hodimlar",
        path:'hodim',
        element:<Hodimlar />
    },
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
export default inRoute