import { inject, injectable } from 'inversify';
import { TUser } from '@src/domain/user/entities/user.type';
import { HttpClient } from '@src/infrastructure/api';
import container from '@src/infrastructure/api/container';
import { type IHttpClient } from '@src/@shared/interfaces/http-client.interface';

@injectable()
class AdminFindUserService {
  public constructor(@inject(HttpClient) private readonly api: IHttpClient) {}

  public async execute(id: string) {
    return await this.api.get<TUser>(`/api/admins/users/${id}`);
  }
}

container.bind(AdminFindUserService).toSelf();
const adminFindUserService = container.get(AdminFindUserService);
export default adminFindUserService;
