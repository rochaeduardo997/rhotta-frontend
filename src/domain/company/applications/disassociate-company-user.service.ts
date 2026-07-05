import { inject, injectable } from 'inversify';
import { HttpClient } from '@src/infrastructure/api';
import container from '@src/infrastructure/api/container';
import { type IHttpClient } from '@src/@shared/interfaces/http-client.interface';

@injectable()
class DisassociateCompanyUserService {
  public constructor(@inject(HttpClient) private readonly api: IHttpClient) {}

  public async execute(companyId: string, userId: string) {
    return await this.api.delete<void>(`/api/companies/${companyId}/users/${userId}`);
  }
}

container.bind(DisassociateCompanyUserService).toSelf();
const disassociateCompanyUserService = container.get(DisassociateCompanyUserService);
export default disassociateCompanyUserService;
