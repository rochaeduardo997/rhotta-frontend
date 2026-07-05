import { inject, injectable } from 'inversify';
import { TCompany } from '@src/domain/company/entities/company.type';
import { HttpClient } from '@src/infrastructure/api';
import container from '@src/infrastructure/api/container';
import { type IHttpClient } from '@src/@shared/interfaces/http-client.interface';

@injectable()
class UpdateCompanyService {
  public constructor(@inject(HttpClient) private readonly api: IHttpClient) {}

  public async execute(id: string, data: { name?: string; cnpj?: number }) {
    return await this.api.patch<TCompany>(`/api/companies/${id}`, data);
  }
}

container.bind(UpdateCompanyService).toSelf();
const updateCompanyService = container.get(UpdateCompanyService);
export default updateCompanyService;
