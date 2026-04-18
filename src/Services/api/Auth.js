import axios from "axios";
import { BASE_URL } from "../parametres/axios";
class Auth {
    static Login = async (data) => {
        const response = await axios.post(`${BASE_URL}/auth/jek/login`, data)
        return response;
    }
    static Register = async (data) => {
        const response = await axios.post(`${BASE_URL}/auth/jek/register`, data)
        return response;
    }
}

export { Auth };