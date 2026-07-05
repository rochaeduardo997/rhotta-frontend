import { inject, injectable } from 'inversify';
import { HttpClient } from '@src/infrastructure/api';
import container from '@src/infrastructure/api/container';
import { type IHttpClient } from '@src/@shared/interfaces/http-client.interface';

@injectable()
class DownloadVehicleDocumentService {
  public constructor(@inject(HttpClient) private readonly api: IHttpClient) {}

  public async execute(id: string) {
    return await this.api.get<any>(`/api/vehicles/${id}/document`, {
      responseType: 'blob'
    });
  }
}

container.bind(DownloadVehicleDocumentService).toSelf();
const downloadVehicleDocumentService = container.get(DownloadVehicleDocumentService);
export default downloadVehicleDocumentService;
