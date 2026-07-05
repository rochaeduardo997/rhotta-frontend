import { TUser } from '@src/domain/user/entities/user.type';

export type TCompanyUser = {
  id: string;
  companyId: string;
  userId: string;
  role: 'owner' | 'employee';
  permission: 'read-only' | 'read-write';
  user?: TUser;
  createdAt?: string;
  updatedAt?: string;
};
