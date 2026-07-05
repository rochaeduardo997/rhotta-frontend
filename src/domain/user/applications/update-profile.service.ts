import { inject, injectable } from 'inversify';
import { TUser } from '@src/domain/user/entities/user.type';
import { HttpClient } from '@src/infrastructure/api';
import container from '@src/infrastructure/api/container';
import { type IHttpClient } from '@src/@shared/interfaces/http-client.interface';

@injectable()
class UpdateProfileService {
  public constructor(@inject(HttpClient) private readonly api: IHttpClient) {}

  public async execute(data: Partial<TUser>) {
    return await this.api.patch<TUser>('/api/users/users', data);
  }
}

container.bind(UpdateProfileService).toSelf();
const updateProfileService = container.get(UpdateProfileService);
export default updateProfileService;
