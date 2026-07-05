import { inject, injectable } from 'inversify';
import { TCompany } from '@src/domain/company/entities/company.type';
import { HttpClient } from '@src/infrastructure/api';
import container from '@src/infrastructure/api/container';
import { type IHttpClient } from '@src/@shared/interfaces/http-client.interface';
import { TPaginatedResponse } from '@src/@shared/types/meta.type';

@injectable()
class FindAllCompaniesService {
  public constructor(@inject(HttpClient) private readonly api: IHttpClient) {}

  public async execute(params?: any) {
    return await this.api.get<TPaginatedResponse<TCompany>>('/api/companies', { params });
  }
}

container.bind(FindAllCompaniesService).toSelf();
const findAllCompaniesService = container.get(FindAllCompaniesService);
export default findAllCompaniesService;
