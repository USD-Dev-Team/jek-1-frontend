import { $api } from "../parametres/axios";
import { BASE_URL } from "../parametres/axios";
class apiProducts {
    static getAll = async () => {
        const response = await $api.get(`${BASE_URL}/products`);
        return response;
    }
    static getWarehouseProducts = async (locId, search, page, limit) => {
        const response = await $api.get(`${BASE_URL}/products/location?locationId=${locId}&search=${search}&page=${page}&limit=${limit}`);
        return response;
    }
    static getById = async (id) => {
        const response = await $api.get(`${BASE_URL}/locations/${id}`);
        return response;
    }
    static Add = async (data) => {
        const response = await $api.post(`${BASE_URL}/products`, data, { showSuccessToast: "Product successfully created" })
        return response;
    }
    static Update = async (data, id) => {
        const response = await $api.put(`${BASE_URL}/products/${id}`, data, { showSuccessToast: "Product successfully updated" })
        return response;
    }
    static Delete = async (id) => {
        const response = await $api.delete(`${BASE_URL}/products/${id}`, { showSuccessToast: "Product successfully deleted" })
        return response;
    }
}

export { apiProducts };