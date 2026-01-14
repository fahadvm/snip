const BASE = '/api';

const AUTH = `${BASE}/auth`;
const URL = `${BASE}/url`;


export const API_ROUTES = {
    auth: {
        signup: `${AUTH}/signup`,
        verifyOtp: `${AUTH}/verify-otp`,
        login: `${AUTH}/login`,
        logout: `${AUTH}/logout`,
        forgotPassword: `${AUTH}/forgot-password`,
        resetPassword: `${AUTH}/reset-password`,
        verifyForgotOtp: `${AUTH}/verify-forgot-otp`,
        resendOtp: `${AUTH}/resend-otp`,
    },
    url: {
        create: `${URL}`,
        list: `${URL}`,
    },
}
