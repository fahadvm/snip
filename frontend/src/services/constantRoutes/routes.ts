const BASE = '/api';

const AUTH = `${BASE}/auth`;
const URL = `${BASE}/url`;


export const API_ROUTES = {
    auth: {
        signup: `${AUTH}/register`,
        verifyOtp: `${AUTH}/verify-otp`,
        login: `${AUTH}/login`,
        logout: `${AUTH}/logout`,
        forgotPassword: `${AUTH}/forgot-password`,
        resetPassword: `${AUTH}/reset-password`,
        verifyForgotOtp: `${AUTH}/verify-forgot-otp`,
        resendOtp: `${AUTH}/resend-otp`,
        me: `${AUTH}/me`,
        refresh: `${AUTH}/refresh`,
    },
    url: {
        create: `${URL}/shorten`,
        list: `${URL}/list`,
        details: (id: string) => `${URL}/details/${id}`,
        update: (id: string) => `${URL}/update/${id}`,
        delete: (id: string) => `${URL}/${id}`,
        analytics: (id: string) => `${URL}/analytics/${id}`,
    },
}
