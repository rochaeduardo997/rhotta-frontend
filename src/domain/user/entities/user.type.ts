import { ERole } from './role.type';

export type TUser = {
  id: string;
  name: string;
  email: string;
  role: ERole;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
};
