import { ERole } from '@src/domain/user/entities/role.type';

export type TUserToken = {
  id: string;
  name: string;
  email: string;
  role: ERole;
  exp?: number;
  iat?: number;
};
