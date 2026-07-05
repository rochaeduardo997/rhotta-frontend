import { inject, injectable } from 'inversify';
import { TFleet } from '@src/domain/fleet/entities/fleet.type';
import { HttpClient } from '@src/infrastructure/api';
import container from '@src/infrastructure/api/container';
import { type IHttpClient } from '@src/@shared/interfaces/http-client.interface';
import { TPaginatedResponse } from '@src/@shared/types/meta.type';

@injectable()
class FindAllFleetsService {
  public constructor(@inject(HttpClient) private readonly api: IHttpClient) {}

  public async execute(branchId: string, params?: any) {
    return await this.api.get<TPaginatedResponse<TFleet>>(`/api/branches/${branchId}/fleets`, { params });
  }
}

container.bind(FindAllFleetsService).toSelf();
const findAllFleetsService = container.get(FindAllFleetsService);
export default findAllFleetsService;
