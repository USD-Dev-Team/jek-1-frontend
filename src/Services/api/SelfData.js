import { $api, BASE_URL } from "../parametres/axios";




class SelfData{
    static getData = async () => {
        const res = await $api.get(`${BASE_URL}/admins/self/data`)
        return res
    }
}


export {SelfData}