import type { NextPageContext } from 'next';
import axios from 'axios';
import { injectable } from 'inversify';
import { destroyCookie, parseCookies } from 'nookies';
import { IHttpClient } from '@src/@shared/interfaces/http-client.interface';
import { COOKIE_TOKEN_KEY } from '@src/@shared/constants/cookie-token.contants';
import { COOKIE_LANGUAGE_KEY } from '@src/@shared/constants/cookie-language.contants';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
const DEFAULT_DESTROY_COOKIE_CONFIG = { path: '/' };

function getApi(context?: Pick<NextPageContext, 'req'>) {
  const { [COOKIE_TOKEN_KEY]: token, [COOKIE_LANGUAGE_KEY]: language } = parseCookies(context);
  const api = axios.create({ baseURL: API_URL });
  if (token) api.defaults.headers['Authorization'] = `Bearer ${token}`;
  if (language) api.defaults.headers['x-lang'] = language;

  api.interceptors.response.use(
    config => config,
    function (error) {
      if (error?.response?.status === 401) {
        destroyCookie(undefined, COOKIE_TOKEN_KEY, DEFAULT_DESTROY_COOKIE_CONFIG);
        window.location.href = `/auth/login`;
      }
      return Promise.reject(error);
    }
  );

  return api;
}

const api = getApi();

@injectable()
export class HttpClient implements IHttpClient {
  public async get<T>(url: string, config?: any): Promise<T> {
    return (await api.get(url, config)).data;
  }

  public async post<T>(url: string, data?: any, config?: any): Promise<T> {
    return (await api.post(url, data, config)).data;
  }

  public async put<T>(url: string, data?: any, config?: any): Promise<T> {
    return (await api.put(url, data, config)).data;
  }

  public async patch<T>(url: string, data?: any, config?: any): Promise<T> {
    return (await api.patch(url, data, config)).data;
  }

  public async delete<T>(url: string, config?: any): Promise<T> {
    return (await api.delete(url, config)).data;
  }
}
