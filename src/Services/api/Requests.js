import axios from "axios";
import { $api, BASE_URL } from "../parametres/axios";

class Requests {
  static changePassword = async (password, passwordConfirm) => {
    const response = await $api.patch(`${BASE_URL}/admins/change/password`, {
      password,
      passwordConfirm
    })
    return response
  }
  static removeAddress = async (jekId, addressId) => {
    const response = await $api.delete(
      `${BASE_URL}/addresses/remove/${jekId}/${addressId}`
    )
    return response
  }
  static assignAddress = async (adminId, district, neighborhood) => {
    const response = await $api.post(
      `${BASE_URL}/addresses/assign/${adminId}`,
      {
        district: district,
        neighborhood: neighborhood,
      }
    );
    return response;
  };
  static getStart = async (id) => {
    const response = await $api.patch(`${BASE_URL}/requests/assign/${id}`);
    return response;
  };
  static Complete = async (id, note, files) => {
    const formData = new FormData();

    formData.append("note", note);

    files.forEach((file) => {
      formData.append("photos", file);
    });

    const response = await $api.patch(
      `${BASE_URL}/requests/complete/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },

      

      },
    );

    return response;
  };
  static getUserInfo = async (id) => {
    const response = await $api.get(`${BASE_URL}/admins/find/${id}`)
    return response
  }
  static getFilteredRequest = async (start, end, tuman, mahalla, status, search, page, limit,) => {
    const response = await $api.get(`${BASE_URL}/requests/universal-search`, {
      params: { startDate: start, endDate: end, district: tuman, neighborhood: mahalla, status: status, search: search, page: page, limit: limit, }
    })
    return response;
  }


  static getFilteredRequest = async (
    start,
    end,
    tuman,
    mahalla,
    status,
    search,
    page,
    limit,
  ) => {
    const response = await $api.get(`${BASE_URL}/requests/universal-search`, {
      params: {
        startDate: start,
        endDate: end,
        district: tuman,
        neighborhood: mahalla,
        status: status,
        search: search,
        page: page,
        limit: limit,
      },
    });

    return response;
  };
  static getEmploye = async ({
    isActive,
    district,
    neighborhood,
    first_name,
    last_name,
    phoneNumber,
    role,
    limit,
    page,
  }) => {
    const response = await $api.get(`${BASE_URL}/admins/filter-list`, {
      params: {
        first_name,
        last_name,
        phoneNumber,
        isActive,
        district,
        neighborhood,
        role,
        limit,
        page,
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

  static getDashboard = async (year, district, adminId, neighborhood) => {
    const response = await $api.get(`${BASE_URL}/statistics/general`, {
      params: {
        year: year,
        district: district,
        adminId: adminId,
        neighborhood: neighborhood
      }
    }

    )
    return response
  }
        
  
  static getDashboardAll = async (year, district, neighborhood) => {
    const response = await $api.get(`${BASE_URL}/statistics/general`, {
      params: {
        year: year,
        district: district,
        neighborhood: neighborhood
      }
    }

    )
    return response
  }
       
  static getById = async (id) => {
    const response = await $api.get(`${BASE_URL}/requests/request/${id}`);
    return response;
  };
}

export { Requests };
