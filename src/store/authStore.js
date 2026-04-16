// src/store/authStore.js 
import { create } from "zustand";
import Cookies from "js-cookie";

export const useAuthStore = create((set, get) => ({
    token: Cookies.get("token") || null,
    refreshToken: Cookies.get("refresh_token") || null,
    userId: Cookies.get("user_id") || null, 
    role: Cookies.get("role") || null, 
    first_name: Cookies.get("first_name") || null, 
    last_name: Cookies.get("last_name") || null, 
    district: Cookies.get("district") || null, 
    neighborhood: Cookies.get("neighborhood") || null, 
    // user: Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null,

    login: ({ token, refreshToken, userId , role , first_name , last_name , district , neighborhood }) => {
        Cookies.set("token", token);
        Cookies.set("refresh_token", refreshToken);
        Cookies.set("user_id", userId); 
        Cookies.set("role", role); 
        Cookies.set("first_name", first_name); 
        Cookies.set("last_name", last_name); 
        Cookies.set("district", district); 
        Cookies.set("neighborhood", neighborhood); 
        // Cookies.set("user", JSON.stringify(user)); 

        set({
            token,
            refreshToken,
            userId, 
            role,
            first_name,
            last_name,
            district,
            neighborhood
            // user, 
        });
    },
    

    setTokens: ({ token, refreshToken }) => {
        if (token) {
            Cookies.set("token", token);
            set({ token });
        }
        if (refreshToken) {
            Cookies.set("refresh_token", refreshToken);
            set({ refreshToken });
        }
    },

    logout: () => {
        Cookies.remove("token");
        Cookies.remove("refresh_token");
        Cookies.remove("user_id");
        Cookies.remove("role");
        Cookies.remove("first_name");
        Cookies.remove("last_name");
        Cookies.remove("district");
        Cookies.remove("neighborhood");
        // Cookies.remove("user");

        set({
            token: null,
            refreshToken: null,
            userId: null,
            role:null,
            first_name:null,
            last_name:null,
            district:null,
            neighborhood:null,
            // user: null,
        });
    },

    isAuthenticated: () => !!Cookies.get("token"),
}));