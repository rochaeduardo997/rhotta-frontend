import { inject, injectable } from 'inversify';
import { TBranch } from '@src/domain/branch/entities/branch.type';
import { HttpClient } from '@src/infrastructure/api';
import container from '@src/infrastructure/api/container';
import { type IHttpClient } from '@src/@shared/interfaces/http-client.interface';
import { TPaginatedResponse } from '@src/@shared/types/meta.type';

@injectable()
class FindAllBranchesService {
  public constructor(@inject(HttpClient) private readonly api: IHttpClient) {}

  public async execute(companyId: string, params?: any) {
    return await this.api.get<TPaginatedResponse<TBranch>>(`/api/companies/${companyId}/branches`, { params });
  }
}

container.bind(FindAllBranchesService).toSelf();
const findAllBranchesService = container.get(FindAllBranchesService);
export default findAllBranchesService;
