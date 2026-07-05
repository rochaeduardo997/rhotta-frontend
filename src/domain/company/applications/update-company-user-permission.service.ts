import { inject, injectable } from 'inversify';
import { HttpClient } from '@src/infrastructure/api';
import container from '@src/infrastructure/api/container';
import { type IHttpClient } from '@src/@shared/interfaces/http-client.interface';

@injectable()
class UpdateCompanyUserPermissionService {
  public constructor(@inject(HttpClient) private readonly api: IHttpClient) {}

  public async execute(companyId: string, userId: string, data: { role?: 'owner' | 'employee'; permission?: 'read-only' | 'read-write' }) {
    return await this.api.patch<any>(`/api/companies/${companyId}/users/${userId}`, data);
  }
}

container.bind(UpdateCompanyUserPermissionService).toSelf();
const updateCompanyUserPermissionService = container.get(UpdateCompanyUserPermissionService);
export default updateCompanyUserPermissionService;
