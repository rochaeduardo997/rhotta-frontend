import { inject, injectable } from 'inversify';
import { TVehicle } from '@src/domain/vehicle/entities/vehicle.type';
import { HttpClient } from '@src/infrastructure/api';
import container from '@src/infrastructure/api/container';
import { type IHttpClient } from '@src/@shared/interfaces/http-client.interface';

@injectable()
class FindVehicleByIdService {
  public constructor(@inject(HttpClient) private readonly api: IHttpClient) {}

  public async execute(id: string) {
    return await this.api.get<TVehicle>(`/api/vehicles/${id}`);
  }
}

container.bind(FindVehicleByIdService).toSelf();
const findVehicleByIdService = container.get(FindVehicleByIdService);
export default findVehicleByIdService;
