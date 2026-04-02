import { $api } from "../parametres/axios";
import { BASE_URL } from "../parametres/axios";
class apiLocation {
    static getAll = async () => {
        const response = await $api.get(`${BASE_URL}/locations`);
        return response;
    }
    static getLocalLocations = async (type, locId) => {
        const response = await $api.get(`${BASE_URL}/locations/type/${type}/${locId}`);
        return response;
    }
    static getById = async (id) => {
        const response = await $api.get(`${BASE_URL}/locations/${id}`);
        return response;
    }
    static Add = async (data) => {
        const response = await $api.post(`${BASE_URL}/locations`, data, { showSuccessToast: "Location successfully created" })
        return response;
    }
    static Update = async (data, id) => {
        const response = await $api.put(`${BASE_URL}/locations/${id}`, data, { showSuccessToast: "Location successfully updated" })
        return response;
    }
    static Delete = async (id) => {
        const response = await $api.delete(`${BASE_URL}/locations/${id}`, { showSuccessToast: "Location successfully deleted" })
        return response;
    }
}

export { apiLocation };