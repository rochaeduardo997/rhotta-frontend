import { inject, injectable } from 'inversify';
import { TVehicle } from '@src/domain/vehicle/entities/vehicle.type';
import { HttpClient } from '@src/infrastructure/api';
import container from '@src/infrastructure/api/container';
import { type IHttpClient } from '@src/@shared/interfaces/http-client.interface';

@injectable()
class UpdateVehicleOperationalService {
  public constructor(@inject(HttpClient) private readonly api: IHttpClient) {}

  public async execute(id: string, data: { status: string; odometerNow: number }) {
    return await this.api.patch<TVehicle>(`/api/vehicles/${id}/operational`, data);
  }
}

container.bind(UpdateVehicleOperationalService).toSelf();
const updateVehicleOperationalService = container.get(UpdateVehicleOperationalService);
export default updateVehicleOperationalService;
