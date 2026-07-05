import { inject, injectable } from 'inversify';
import { HttpClient } from '@src/infrastructure/api';
import container from '@src/infrastructure/api/container';
import { type IHttpClient } from '@src/@shared/interfaces/http-client.interface';

@injectable()
class AdminDeleteUserService {
  public constructor(@inject(HttpClient) private readonly api: IHttpClient) {}

  public async execute(id: string) {
    return await this.api.delete<void>(`/api/admins/users/${id}`);
  }
}

container.bind(AdminDeleteUserService).toSelf();
const adminDeleteUserService = container.get(AdminDeleteUserService);
export default adminDeleteUserService;
