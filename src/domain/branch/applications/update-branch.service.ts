import { inject, injectable } from 'inversify';
import { TBranch } from '@src/domain/branch/entities/branch.type';
import { HttpClient } from '@src/infrastructure/api';
import container from '@src/infrastructure/api/container';
import { type IHttpClient } from '@src/@shared/interfaces/http-client.interface';

@injectable()
class UpdateBranchService {
  public constructor(@inject(HttpClient) private readonly api: IHttpClient) {}

  public async execute(id: string, data: { name?: string; description?: string }) {
    return await this.api.patch<TBranch>(`/api/branches/${id}`, data);
  }
}

container.bind(UpdateBranchService).toSelf();
const updateBranchService = container.get(UpdateBranchService);
export default updateBranchService;
