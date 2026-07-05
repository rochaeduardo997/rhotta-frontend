import { inject, injectable } from 'inversify';
import { TUser } from '@src/domain/user/entities/user.type';
import { HttpClient } from '@src/infrastructure/api';
import container from '@src/infrastructure/api/container';
import { type IHttpClient } from '@src/@shared/interfaces/http-client.interface';

@injectable()
class FindProfileService {
  public constructor(@inject(HttpClient) private readonly api: IHttpClient) {}

  public async execute() {
    return await this.api.get<TUser>('/api/users/users');
  }
}

container.bind(FindProfileService).toSelf();
const findProfileService = container.get(FindProfileService);
export default findProfileService;
