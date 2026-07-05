import { inject, injectable } from 'inversify';
import { TSignupRequest } from '@src/domain/auth/entities/signup-request.type';
import { TSignupResponse } from '@src/domain/auth/entities/signup-response.type';
import { HttpClient } from '@src/infrastructure/api';
import container from '@src/infrastructure/api/container';
import { type IHttpClient } from '@src/@shared/interfaces/http-client.interface';

@injectable()
class SignupService {
  public constructor(@inject(HttpClient) private readonly api: IHttpClient) {}

  public async execute(data: TSignupRequest) {
    return await this.api.post<TSignupResponse>('/api/auth/signup', data);
  }
}

container.bind(SignupService).toSelf();
const signupService = container.get(SignupService);
export default signupService;
