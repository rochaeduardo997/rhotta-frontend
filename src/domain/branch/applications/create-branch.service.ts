import { inject, injectable } from 'inversify';
import { TBranch } from '@src/domain/branch/entities/branch.type';
import { HttpClient } from '@src/infrastructure/api';
import container from '@src/infrastructure/api/container';
import { type IHttpClient } from '@src/@shared/interfaces/http-client.interface';

@injectable()
class CreateBranchService {
  public constructor(@inject(HttpClient) private readonly api: IHttpClient) {}

  public async execute(companyId: string, data: { name: string; description?: string }) {
    return await this.api.post<TBranch>(`/api/companies/${companyId}/branches`, data);
  }
}

container.bind(CreateBranchService).toSelf();
const createBranchService = container.get(CreateBranchService);
export default createBranchService;
