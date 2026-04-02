import { $api } from "../parametres/axios";
import { BASE_URL } from "../parametres/axios";
class apiLocation {
    static getWarehouses = async (id) => {
        const response = await $api.get(`${BASE_URL}/locations`)
        return response;
    }
    static Add = async (data) => {
        const response = await $api.post(`${BASE_URL}/locations`, data, { showSuccessToast: "Warehouses successfully created" })
        return response;
    }
    static Update = async (data, id) => {
        const response = await $api.put(`${BASE_URL}/locations/${id}`, data, { showSuccessToast: "Warehouses successfully updated" })
        return response;
    }
    static Delete = async (id) => {
        const response = await $api.delete(`${BASE_URL}/locations/${id}`, { showSuccessToast: "Warehouses successfully deleted" })
        return response;
    }
}

export { apiLocation };