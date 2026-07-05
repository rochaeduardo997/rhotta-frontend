'use client';

import { destroyCookie, parseCookies, setCookie } from 'nookies';
import { jwtDecode } from 'jwt-decode';
import { TUserToken } from '@src/domain/auth/entities/user-token.type';
import AuthContext from '@src/@shared/contexts/auth/auth.context';
import { TLoginRequest } from '@src/domain/auth/entities/login-request.type';
import loginService from '@src/domain/auth/applications/login.service';
import { ERole } from '@src/domain/user/entities/role.type';
import getSocket from '@src/infrastructure/socket-io.client';
import { TSignupRequest } from '@src/domain/auth/entities/signup-request.type';
import signupService from '@src/domain/auth/applications/signup.service';
import logoutService from '@src/domain/auth/applications/logout.service';
import { COOKIE_TOKEN_KEY } from '@src/@shared/constants/cookie-token.contants';

const DEFAULT_COOKIE_MAX_AGE = 60 * 60 * 1; // 1 hour
const REMEMBER_ME_COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

const DEFAULT_SET_COOKIE_CONFIG = {
  path: '/',
  secure: true,
  sameSite: 'none' as const,
  maxAge: DEFAULT_COOKIE_MAX_AGE,
  ...(process.env.NEXT_PUBLIC_ENV === 'production' && { domain: '.mtalent.com.br' })
};
const DEFAULT_DESTROY_COOKIE_CONFIG = { path: '/' };

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { [COOKIE_TOKEN_KEY]: token } = parseCookies();

  const user = token ? (jwtDecode(token) as TUserToken) : null;

  const login = async ({ login, password, rememberMe }: TLoginRequest) => {
    const { accessToken } = await loginService.execute({ login, password, rememberMe });

    const cookieConfig = {
      ...DEFAULT_SET_COOKIE_CONFIG,
      maxAge: rememberMe ? REMEMBER_ME_COOKIE_MAX_AGE : DEFAULT_COOKIE_MAX_AGE
    };

    setCookie(undefined, COOKIE_TOKEN_KEY, accessToken, cookieConfig);
    window.location.href = '/companies';
  };

  const signup = async ({ email, password, name }: TSignupRequest) => {
    const { accessToken } = await signupService.execute({ email, password, name });
    setCookie(undefined, COOKIE_TOKEN_KEY, accessToken, DEFAULT_SET_COOKIE_CONFIG);
    window.location.href = '/companies';
  };

  const logOut = () => {
    logoutService.execute().finally(() => {
      destroyCookie(undefined, COOKIE_TOKEN_KEY, DEFAULT_DESTROY_COOKIE_CONFIG);
      window.location.href = '/auth/login';
    });
  };

  const hasPermission = (role: ERole) => {
    if (!user?.role) return false;
    const result = user.role === role;
    return result;
  };

  const profileType = {
    isAdmin: !!user && /admin/.test(user.role),
    isSupervisor: !!user && /supervisor/.test(user.role),
    isBasic: !!user && /basic/.test(user.role),
    isAPI: !!user && /api/.test(user.role)
  };

  const socketClient = getSocket(token);

  return <AuthContext.Provider value={{ user, logOut, signup, login, hasPermission, profileType, socketClient }}>{children}</AuthContext.Provider>;
}
