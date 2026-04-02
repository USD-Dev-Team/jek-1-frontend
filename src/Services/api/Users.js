import { $api } from "../parametres/axios";
import { BASE_URL } from "../parametres/axios";
class apiUsers {
    static getUser = async (id) => {
        const response = await $api.get(`${BASE_URL}/user/${id}`);
        return response;
    }
    static getAll = async () => {
        const response = await $api.get(`${BASE_URL}/user`);
        return response;
    }
    static getWarehouseUsers = async (locId, page, limit) => {
        const response = await $api.get(`${BASE_URL}/user/page/${locId}?page=${page}&limit=${limit}`);
        return response;
    }
    static getUsersByRole = async (role) => {
        const response = await $api.get(`${BASE_URL}/user/role/${role}`);
        return response;
    }
    static Add = async (data) => {
        const response = await $api.post(`${BASE_URL}/user`, data, { showSuccessToast: "User successfully created" })
        return response;
    }
    static Update = async (data, id) => {
        const response = await $api.put(`${BASE_URL}/user/${id}`, data, { showSuccessToast: "User successfully updated" })
        return response;
    }
    static Delete = async (id) => {
        const response = await $api.delete(`${BASE_URL}/user/${id}`, { showSuccessToast: "User successfully deleted" })
        return response;
    }
    static ResetPassword = async (id, data) => {
        const response = await $api.post(`${BASE_URL}/user/reset-password/${id}`, data, { showSuccessToast: "Password successfully changed" });
        return response
    }
}

export { apiUsers };