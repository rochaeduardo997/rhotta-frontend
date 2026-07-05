import { inject, injectable } from 'inversify';
import { TVehicle } from '@src/domain/vehicle/entities/vehicle.type';
import { HttpClient } from '@src/infrastructure/api';
import container from '@src/infrastructure/api/container';
import { type IHttpClient } from '@src/@shared/interfaces/http-client.interface';

@injectable()
class CreateVehicleService {
  public constructor(@inject(HttpClient) private readonly api: IHttpClient) {}

  public async execute(fleetId: string, data: any) {
    return await this.api.post<TVehicle>(`/api/fleets/${fleetId}/vehicles`, data);
  }
}

container.bind(CreateVehicleService).toSelf();
const createVehicleService = container.get(CreateVehicleService);
export default createVehicleService;
