import { inject, injectable } from 'inversify';
import { TCompany } from '@src/domain/company/entities/company.type';
import { HttpClient } from '@src/infrastructure/api';
import container from '@src/infrastructure/api/container';
import { type IHttpClient } from '@src/@shared/interfaces/http-client.interface';

@injectable()
class CreateCompanyService {
  public constructor(@inject(HttpClient) private readonly api: IHttpClient) {}

  public async execute(data: { name: string; cnpj: number }) {
    return await this.api.post<TCompany>('/api/companies', data);
  }
}

container.bind(CreateCompanyService).toSelf();
const createCompanyService = container.get(CreateCompanyService);
export default createCompanyService;
