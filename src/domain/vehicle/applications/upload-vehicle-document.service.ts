import { inject, injectable } from 'inversify';
import { HttpClient } from '@src/infrastructure/api';
import container from '@src/infrastructure/api/container';
import { type IHttpClient } from '@src/@shared/interfaces/http-client.interface';

@injectable()
class UploadVehicleDocumentService {
  public constructor(@inject(HttpClient) private readonly api: IHttpClient) {}

  public async execute(id: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return await this.api.post<{ documentKey: string }>(`/api/vehicles/${id}/document`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
}

container.bind(UploadVehicleDocumentService).toSelf();
const uploadVehicleDocumentService = container.get(UploadVehicleDocumentService);
export default uploadVehicleDocumentService;
