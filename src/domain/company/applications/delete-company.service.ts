import { inject, injectable } from 'inversify';
import { HttpClient } from '@src/infrastructure/api';
import container from '@src/infrastructure/api/container';
import { type IHttpClient } from '@src/@shared/interfaces/http-client.interface';

@injectable()
class DeleteCompanyService {
  public constructor(@inject(HttpClient) private readonly api: IHttpClient) {}

  public async execute(id: string) {
    return await this.api.delete<void>(`/api/companies/${id}`);
  }
}

container.bind(DeleteCompanyService).toSelf();
const deleteCompanyService = container.get(DeleteCompanyService);
export default deleteCompanyService;
