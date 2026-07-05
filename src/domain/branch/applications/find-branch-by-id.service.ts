import { inject, injectable } from 'inversify';
import { TBranch } from '@src/domain/branch/entities/branch.type';
import { HttpClient } from '@src/infrastructure/api';
import container from '@src/infrastructure/api/container';
import { type IHttpClient } from '@src/@shared/interfaces/http-client.interface';

@injectable()
class FindBranchByIdService {
  public constructor(@inject(HttpClient) private readonly api: IHttpClient) {}

  public async execute(id: string) {
    return await this.api.get<TBranch>(`/api/branches/${id}`);
  }
}

container.bind(FindBranchByIdService).toSelf();
const findBranchByIdService = container.get(FindBranchByIdService);
export default findBranchByIdService;
