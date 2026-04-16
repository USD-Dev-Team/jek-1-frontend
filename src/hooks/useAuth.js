// src/hooks/useAuth.js
import { useAuthStore } from "../store/authStore";

export const useAuth = () => {
    const loginToStore = useAuthStore((s) => s.login);
    const logoutFromStore = useAuthStore((s) => s.logout);

    // LOGIN
    const login = ({ token, refreshToken, userId, role, first_name, last_name, district, neighborhood }) => {
        loginToStore({ token, refreshToken, userId, role, first_name, last_name, district, neighborhood });
    };

    // LOGOUT
    const logout = () => {
        logoutFromStore();
        window.location.href = "/login";
    };


    return {
        login,
        logout,
    };
};