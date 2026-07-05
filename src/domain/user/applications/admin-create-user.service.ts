import { inject, injectable } from 'inversify';
import { TUser } from '@src/domain/user/entities/user.type';
import { HttpClient } from '@src/infrastructure/api';
import container from '@src/infrastructure/api/container';
import { type IHttpClient } from '@src/@shared/interfaces/http-client.interface';

@injectable()
class AdminCreateUserService {
  public constructor(@inject(HttpClient) private readonly api: IHttpClient) {}

  public async execute(data: Partial<TUser>) {
    return await this.api.post<TUser>('/api/admins/users', data);
  }
}

container.bind(AdminCreateUserService).toSelf();
const adminCreateUserService = container.get(AdminCreateUserService);
export default adminCreateUserService;
