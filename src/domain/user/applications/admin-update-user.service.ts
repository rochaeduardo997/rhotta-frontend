import { inject, injectable } from 'inversify';
import { TUser } from '@src/domain/user/entities/user.type';
import { HttpClient } from '@src/infrastructure/api';
import container from '@src/infrastructure/api/container';
import { type IHttpClient } from '@src/@shared/interfaces/http-client.interface';

@injectable()
class AdminUpdateUserService {
  public constructor(@inject(HttpClient) private readonly api: IHttpClient) {}

  public async execute(id: string, data: Partial<TUser>) {
    return await this.api.patch<TUser>(`/api/admins/users/${id}`, data);
  }
}

container.bind(AdminUpdateUserService).toSelf();
const adminUpdateUserService = container.get(AdminUpdateUserService);
export default adminUpdateUserService;
