'use client';

import { TLoginRequest } from '@src/domain/auth/entities/login-request.type';
import { TSignupRequest } from '@src/domain/auth/entities/signup-request.type';
import { TUserToken } from '@src/domain/auth/entities/user-token.type';
import { ERole } from '@src/domain/user/entities/role.type';
import { createContext } from 'react';
import { Socket } from 'socket.io-client';

type TAuthContext = {
  user: TUserToken | null;
  login: (data: TLoginRequest) => Promise<void>;
  signup: (data: TSignupRequest) => Promise<void>;
  logOut: () => void;
  hasPermission: (role: ERole) => boolean;
  profileType: {
    isAdmin: boolean;
    isSupervisor: boolean;
    isBasic: boolean;
    isAPI: boolean;
  };
  socketClient: Socket | undefined;
};

const authContext = createContext({} as TAuthContext);

export default authContext;
