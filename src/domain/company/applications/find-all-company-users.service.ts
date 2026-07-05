import { inject, injectable } from 'inversify';
import { HttpClient } from '@src/infrastructure/api';
import container from '@src/infrastructure/api/container';
import { type IHttpClient } from '@src/@shared/interfaces/http-client.interface';
import { TUser } from '@src/domain/user/entities/user.type';

type TCompanyUsersResponse = {
  employees: (TUser & { permission: 'read-only' | 'read-write' })[];
  owners: TUser[];
};

@injectable()
class FindAllCompanyUsersService {
  public constructor(@inject(HttpClient) private readonly api: IHttpClient) {}

  public async execute(companyId: string) {
    return await this.api.get<TCompanyUsersResponse>(`/api/companies/${companyId}/users`);
  }
}

container.bind(FindAllCompanyUsersService).toSelf();
const findAllCompanyUsersService = container.get(FindAllCompanyUsersService);
export default findAllCompanyUsersService;
