import { inject, injectable } from 'inversify';
import { HttpClient } from '@src/infrastructure/api';
import container from '@src/infrastructure/api/container';
import { type IHttpClient } from '@src/@shared/interfaces/http-client.interface';

@injectable()
class AssociateCompanyUserService {
  public constructor(@inject(HttpClient) private readonly api: IHttpClient) {}

  public async execute(companyId: string, data: { userId: string; role: 'owner' | 'employee'; permission: 'read-only' | 'read-write' }) {
    return await this.api.post<any>(`/api/companies/${companyId}/users`, data);
  }
}

container.bind(AssociateCompanyUserService).toSelf();
const associateCompanyUserService = container.get(AssociateCompanyUserService);
export default associateCompanyUserService;
