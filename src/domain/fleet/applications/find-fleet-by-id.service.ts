import { inject, injectable } from 'inversify';
import { TFleet } from '@src/domain/fleet/entities/fleet.type';
import { HttpClient } from '@src/infrastructure/api';
import container from '@src/infrastructure/api/container';
import { type IHttpClient } from '@src/@shared/interfaces/http-client.interface';

@injectable()
class FindFleetByIdService {
  public constructor(@inject(HttpClient) private readonly api: IHttpClient) {}

  public async execute(id: string) {
    return await this.api.get<TFleet>(`/api/fleets/${id}`);
  }
}

container.bind(FindFleetByIdService).toSelf();
const findFleetByIdService = container.get(FindFleetByIdService);
export default findFleetByIdService;
