import { $api } from "../parametres/axios";
import { BASE_URL } from "../parametres/axios";
class apiInvoice {
    static getById = async (id) => {
        const response = await $api.get(`${BASE_URL}/invoices/${id}`);
        return response;
    }
    static Add = async (data) => {
        const response = await $api.post(`${BASE_URL}/invoices`, data, { showSuccessToast: "Invoice successfully created" })
        return response;
    }
    static getFilteredInvoices = async (locId, start, end, type, status, payment, search, page) => {
        const response = await $api.get(`${BASE_URL}/invoices/filter/${locId}/${start}/${end}/${type}/${status}/${payment}/${search}/page?page=${page}`);
        return response;
    }
}

export { apiInvoice };