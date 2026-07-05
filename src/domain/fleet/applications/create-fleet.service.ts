import { inject, injectable } from 'inversify';
import { TFleet } from '@src/domain/fleet/entities/fleet.type';
import { HttpClient } from '@src/infrastructure/api';
import container from '@src/infrastructure/api/container';
import { type IHttpClient } from '@src/@shared/interfaces/http-client.interface';

@injectable()
class CreateFleetService {
  public constructor(@inject(HttpClient) private readonly api: IHttpClient) {}

  public async execute(branchId: string, data: { name: string; description?: string }) {
    return await this.api.post<TFleet>(`/api/branches/${branchId}/fleets`, data);
  }
}

container.bind(CreateFleetService).toSelf();
const createFleetService = container.get(CreateFleetService);
export default createFleetService;
