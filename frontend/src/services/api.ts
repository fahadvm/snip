import axiosInstance from "./axiosInstance";
import { AxiosError } from "axios";
import { showErrorToast } from "../utils/Toast";
import type { ApiResponse } from "../types/apiResponse";

const handleError = (error: AxiosError): null => {
    const errorData = error.response?.data as { message?: string | string[] };
    let message = errorData?.message ?? "Request failed";

    if (Array.isArray(message)) {
        message = message.join(', ');
    }

    showErrorToast(message);
    return null;
};

export const getRequest = async <T>(
    url: string
): Promise<ApiResponse<T> | null> => {
    try {
        const res = await axiosInstance.get<ApiResponse<T>>(url);
        return res.data;
    } catch (error) {
        return handleError(error as AxiosError);
    }
};

export const postRequest = async <T, B>(
    url: string,
    body: B
): Promise<ApiResponse<T> | null> => {
    try {
        const res = await axiosInstance.post<ApiResponse<T>>(url, body);
        return res.data;
    } catch (error) {
        return handleError(error as AxiosError);
    }
};

export const deleteRequest = async <T>(
    url: string
): Promise<ApiResponse<T> | null> => {
    try {
        const res = await axiosInstance.delete<ApiResponse<T>>(url);
        return res.data;
    } catch (error) {
        return handleError(error as AxiosError);
    }
};
