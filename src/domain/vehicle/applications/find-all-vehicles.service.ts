import { inject, injectable } from 'inversify';
import { TVehicle } from '@src/domain/vehicle/entities/vehicle.type';
import { HttpClient } from '@src/infrastructure/api';
import container from '@src/infrastructure/api/container';
import { type IHttpClient } from '@src/@shared/interfaces/http-client.interface';
import { TPaginatedResponse } from '@src/@shared/types/meta.type';

@injectable()
class FindAllVehiclesService {
  public constructor(@inject(HttpClient) private readonly api: IHttpClient) {}

  public async execute(params?: any) {
    return await this.api.get<TPaginatedResponse<TVehicle>>('/api/vehicles', { params });
  }
}

container.bind(FindAllVehiclesService).toSelf();
const findAllVehiclesService = container.get(FindAllVehiclesService);
export default findAllVehiclesService;
