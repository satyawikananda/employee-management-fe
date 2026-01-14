import axios, {
  Axios,
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  RawAxiosRequestHeaders,
} from 'axios';
import { stringify } from 'qs';
import { headerAuth } from "@/lib/api/headerAuth";

import { toast } from 'sonner';
import { signOut } from 'next-auth/react';

export class BaseApi {
  protected axios: Axios

  constructor() {
    this.axios = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
    });
    this.axios.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            toast.error("Session expired. Please sign in again.");
            await signOut({ callbackUrl: '/sign-in' });
          }

          error.message =
            error?.response?.data?.error?.message ||
            'An error occured while intract with the server';
          if (typeof error.message === 'object') {
            if ((error?.message as { message: string })?.message) {
              error.message = (error.message as { message: string }).message;
            } else {
              error.message = 'An error occured while intract with the server';
            }
          }
        }
        return Promise.reject(error);
      },
    );
  }

  public serialize(params: Record<string, string | number>) {
    return stringify(params, { arrayFormat: 'comma', skipNulls: true });
  }

  async get<T>({
    url,
    headers,
    options,
    query,
    useToken = true,
  }: {
    url: string;
    headers?: RawAxiosRequestHeaders;
    options?: AxiosRequestConfig;
    query?: Record<string, string | number>;
    useToken?: boolean;
  }): Promise<T> {
    headers = await headerAuth(headers, useToken);
    if (query) {
      url = `${url}?${this.serialize(query)}`;
    }
    const response = await this.axios.get<T>(url, {
      headers,
      ...options,
    });
    return response.data;
  }

  async post<T, D = unknown>({
    url,
    data,
    headers,
    opts,
    useToken = true,
  }: {
    url: string;
    data?: D;
    headers?: RawAxiosRequestHeaders;
    opts?: AxiosRequestConfig;
    useToken?: boolean;
  }): Promise<T> {
    headers = await headerAuth(headers, useToken);
    const response = await this.axios.post<D, AxiosResponse<T>>(url, data, {
      headers,
      ...opts,
    });
    return response.data;
  }

  async put<T, D = unknown>({
    url,
    data,
    headers,
    useToken = true,
  }: {
    url: string;
    data?: D;
    headers?: RawAxiosRequestHeaders;
    useToken?: boolean;
  }): Promise<T> {
    headers = await headerAuth(headers, useToken);
    const response = await this.axios.put<D, AxiosResponse<T>>(url, data, {
      headers,
    });
    return response.data;
  }

  async delete<T>({
    url,
    headers,
    useToken = true,
  }: {
    url: string;
    headers?: RawAxiosRequestHeaders;
    useToken?: boolean;
  }): Promise<T> {
    headers = await headerAuth(headers, useToken);
    const response = await this.axios.delete<T>(url, {
      headers,
    });
    return response.data;
  }

  async patch<T, D>({
    url,
    data,
    headers,
    useToken = true,
  }: {
    url: string;
    data: D;
    headers?: RawAxiosRequestHeaders;
    useToken?: boolean;
  }): Promise<T> {
    headers = await headerAuth(headers, useToken);
    const response = await this.axios.patch<T>(url, data, {
      headers,
    });
    return response.data;
  }
}