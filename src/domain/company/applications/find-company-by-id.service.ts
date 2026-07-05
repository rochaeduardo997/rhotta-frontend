import { inject, injectable } from 'inversify';
import { TCompany } from '@src/domain/company/entities/company.type';
import { HttpClient } from '@src/infrastructure/api';
import container from '@src/infrastructure/api/container';
import { type IHttpClient } from '@src/@shared/interfaces/http-client.interface';

@injectable()
class FindCompanyByIdService {
  public constructor(@inject(HttpClient) private readonly api: IHttpClient) {}

  public async execute(id: string) {
    return await this.api.get<TCompany>(`/api/companies/${id}`);
  }
}

container.bind(FindCompanyByIdService).toSelf();
const findCompanyByIdService = container.get(FindCompanyByIdService);
export default findCompanyByIdService;
