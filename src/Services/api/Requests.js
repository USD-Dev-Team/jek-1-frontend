import axios from "axios";
import { $api, BASE_URL } from "../parametres/axios";

class Requests {
  //    static getAll = async (status, page, limit, ) => {
  //         const response = await $api.get(`${BASE_URL}/requests/jek/list?status=${status}&page=${page}&limit=${limit}`, )
  //         return response;
  //     }
  static getStart = async (id) => {
    const response = await $api.patch(`${BASE_URL}/requests/assign/${id}`);
    return response;
  };
  static Complete = async (id, note) => {
    const response = await $api.patch(`${BASE_URL}/requests/complete/${id}`, {
      note: note,
    });
    return response;
  };
  static getFilteredRequest = async ( start, end, tuman, mahalla, status, search, page, limit,) => {
    const response = await $api.get(`${BASE_URL}/requests/universal-search`, {
      params: {  startDate: start,  endDate: end,  district: tuman,  neighborhood: mahalla,  status: status,  search: search,  page: page,  limit: limit, },
    });

    return response;
  };
  static getEmploye = async ({ isActive, district, neighborhood, first_name, last_name, phoneNumber,
  }) => {
    const response = await $api.get(`${BASE_URL}/admins/filter-list`, {
      params: {
        first_name,
        last_name,
        phoneNumber,
        isActive,
        district,
        neighborhood,
      },
    });

    return response;
  };

  static updateStatus = async ({ id, isActive }) => {
    const response = await $api.patch(
      `${BASE_URL}/admins/update/status/${id}`,
      {
        isActive: isActive,
      },
    );
    return response;
  };

  static getDashboard = async (year,district, adminId, neighborhood)=> {
    const response = await $api.get(`${BASE_URL}/statistics/general`,{
      params:{
        year:year,
        district:district,
        adminId:adminId,
        neighborhood:neighborhood
      }
    }
    
    )
    return response
  }
}

export { Requests }