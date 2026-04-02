import { $api } from "../parametres/axios";
import { BASE_URL } from "../parametres/axios";
class apiStock {
    static getAll = async () => {
        const response = await $api.get(`${BASE_URL}/stocks`);
        return response;
    }
    static getByLocationId = async (id) => {
        const response = await $api.get(`${BASE_URL}/stocks${id}`);
        return response;
    }
    static getOperationStocks = async (locId, type, search) => {
        const response = await $api.get(`${BASE_URL}/stocks/inv?locationId=${locId}&type=${type}&searchText=${search}`);
        return response;
    }
    static getById = async (id) => {
        const response = await $api.get(`${BASE_URL}/lstocks/${id}`);
        return response;
    }
}

export { apiStock };