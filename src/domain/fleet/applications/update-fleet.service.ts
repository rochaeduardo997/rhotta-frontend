import { inject, injectable } from 'inversify';
import { TFleet } from '@src/domain/fleet/entities/fleet.type';
import { HttpClient } from '@src/infrastructure/api';
import container from '@src/infrastructure/api/container';
import { type IHttpClient } from '@src/@shared/interfaces/http-client.interface';

@injectable()
class UpdateFleetService {
  public constructor(@inject(HttpClient) private readonly api: IHttpClient) {}

  public async execute(id: string, data: { name?: string; description?: string }) {
    return await this.api.patch<TFleet>(`/api/fleets/${id}`, data);
  }
}

container.bind(UpdateFleetService).toSelf();
const updateFleetService = container.get(UpdateFleetService);
export default updateFleetService;
