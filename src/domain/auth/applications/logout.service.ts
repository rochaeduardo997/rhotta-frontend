import { inject, injectable } from 'inversify';
import { HttpClient } from '@src/infrastructure/api';
import container from '@src/infrastructure/api/container';
import { type IHttpClient } from '@src/@shared/interfaces/http-client.interface';

@injectable()
class LogoutService {
  public constructor(@inject(HttpClient) private readonly api: IHttpClient) {}

  public async execute() {
    return await this.api.post<any>('/api/auth/logout', {});
  }
}

container.bind(LogoutService).toSelf();
const logoutService = container.get(LogoutService);
export default logoutService;
