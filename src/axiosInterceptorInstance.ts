"use client";
import axios from "axios";
// import { BASE_URL } from './api/api_url';
import {
  AxiosError,
  AxiosInstance,
} from "axios";

let BASE_URL = process.env.NODE_ENV == "development"
  ? `http://localhost:9999/api/`
  : "https://loopbackendnew.loop.rockymountaintech.co/api/";


const axiosInterceptorInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL, // API base URL
});

const { parse } = require("url");
const url: string | null =
  typeof window !== "undefined" ? window.location.href : "";
const { query } = parse(url, true);

// Request interceptor
axiosInterceptorInstance.interceptors.request.use(
  (config) => {
    // Modify the request config here (add headers, authentication tokens)
    const accessToken = localStorage.getItem(`userToken-${query.id}`) || "";
    // If token is present add it to request's Authorization Header
    if (accessToken) {
      if (config.headers)
        config.headers.Authorization = `Bearer ${accessToken.substring(
          1,
          accessToken.length - 1
        )}`;
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    // Handle request errors here
    return Promise.reject(error);
  }
);
// End of Request interceptor

// Response interceptor
axiosInterceptorInstance.interceptors.response.use(
  (response) => {
    // Modify the response data here

    return response;
  },
  (error) => {
    // Handle response errors here

    return Promise.reject(error);
  }
);
// End of Response interceptor

export default axiosInterceptorInstance;
