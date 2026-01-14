import { BaseApi } from "@/lib/api/base";

class AuthApi extends BaseApi {
  login(email: string, password: string) {
    return this.post<BaseApiResult<LoginResponse>, LoginRequest>({
      url: '/auth/login',
      data: { email, password },
    });
  }
}


const authApi = new AuthApi()

export { authApi }