import { BaseApi } from "@/lib/api/base";
import { AxiosProgressEvent } from "axios";

class EmployeeApi extends BaseApi {
  async getEmployees(query: Partial<PaginatedFilters>) {
    return this.get<BasePaginatedApiResult<EmployeeResponse[]>>({
      url: '/employee',
      query
    });
  }

  async employeeById(id: string) {
    return this.get<BaseApiResult<EmployeeResponse>>({
      url: `/employee/${id}`,
    });
  }

  async createEmployee(data: EmployeeRequest) {
    return this.post<BaseApiResult<EmployeeResponse>>({
      url: '/employee',
      data
    });
  }

  async updateEmployee(id: string, data: EmployeeRequest) {
    return this.patch<BaseApiResult<EmployeeResponse>, EmployeeRequest>({
      url: `/employee/${id}`,
      data
    });
  }

  async deleteEmployee(id: string) {
    return this.delete<BaseApiResult<EmployeeResponse>>({
      url: `/employee/${id}`,
    });
  }

  async bulkUpload(data: FormData, onUploadProgress?: (progressEvent: AxiosProgressEvent) => void) {
    return this.post({
      url: '/employee/bulk-upload',
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      opts: {
        onUploadProgress,
      }
    });
  }
}


const employeeApi = new EmployeeApi()

export { employeeApi }