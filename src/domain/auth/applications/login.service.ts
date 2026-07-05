import { inject, injectable } from 'inversify';
import { TLoginRequest } from '@src/domain/auth/entities/login-request.type';
import { TLoginResponse } from '@src/domain/auth/entities/login-response.type';
import { HttpClient } from '@src/infrastructure/api';
import container from '@src/infrastructure/api/container';
import { type IHttpClient } from '@src/@shared/interfaces/http-client.interface';

@injectable()
class LoginService {
  public constructor(@inject(HttpClient) private readonly api: IHttpClient) {}

  public async execute(data: TLoginRequest) {
    return await this.api.post<TLoginResponse>('/api/auth/signin', data);
  }
}

container.bind(LoginService).toSelf();
const loginService = container.get(LoginService);
export default loginService;
