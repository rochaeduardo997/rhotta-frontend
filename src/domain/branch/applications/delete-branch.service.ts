import { inject, injectable } from 'inversify';
import { HttpClient } from '@src/infrastructure/api';
import container from '@src/infrastructure/api/container';
import { type IHttpClient } from '@src/@shared/interfaces/http-client.interface';

@injectable()
class DeleteBranchService {
  public constructor(@inject(HttpClient) private readonly api: IHttpClient) {}

  public async execute(id: string) {
    return await this.api.delete<void>(`/api/branches/${id}`);
  }
}

container.bind(DeleteBranchService).toSelf();
const deleteBranchService = container.get(DeleteBranchService);
export default deleteBranchService;
