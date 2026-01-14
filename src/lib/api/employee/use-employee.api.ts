import { employeeApi } from "@/lib/api/employee/employee.api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useNotification } from "@/components/provider/notification.provider"
import { UserPlus } from "lucide-react"

enum EmployeeServices {
  GET_EMPLOYEES = 'employee:get-employees',
  GET_EMPLOYEE_BY_ID = 'employee:get-employee-by-id',
  CREATE_EMPLOYEE = 'employee:create-employee',
  UPDATE_EMPLOYEE = 'employee:update-employee',
  DELETE_EMPLOYEE = 'employee:delete-employee',
  BULK_IMPORT = 'employee:bulk-import',
}

function useEmployeeServices() {
  const queryClient = useQueryClient()
  const { addNotification } = useNotification()

  const useGetEmployees = (query: Partial<PaginatedFilters>) =>
    useQuery({
      queryKey: [EmployeeServices.GET_EMPLOYEES, query],
      queryFn: () => employeeApi.getEmployees(query),
    })

  const useGetEmployeeById = (id: string) =>
    useQuery({
      queryKey: [EmployeeServices.GET_EMPLOYEE_BY_ID, id],
      queryFn: () => employeeApi.employeeById(id),
      enabled: !!id,
    })

  const useCreateEmployee = () =>
    useMutation({
      mutationKey: [EmployeeServices.CREATE_EMPLOYEE],
      mutationFn: (data: EmployeeRequest) => employeeApi.createEmployee(data),
      onSuccess: () => {
        toast.success("Employee created successfully")
        addNotification({
          title: "Employee Created",
          description: "Employee created successfully",
          icon: UserPlus,
          color: "text-green-500",
          bgColor: "bg-green-500/10",
        })
        queryClient.invalidateQueries({ queryKey: [EmployeeServices.GET_EMPLOYEES] })
      },
      onError: (error) => {
        console.error(error, 'err')
        toast.error(error?.message || "Failed to create employee")
      },
    })

  const useUpdateEmployee = () =>
    useMutation({
      mutationKey: [EmployeeServices.UPDATE_EMPLOYEE],
      mutationFn: ({ id, data }: { id: string; data: EmployeeRequest }) =>
        employeeApi.updateEmployee(id, data),
      onSuccess: (_, { id }) => {
        toast.success("Employee updated successfully")
        queryClient.invalidateQueries({ queryKey: [EmployeeServices.GET_EMPLOYEES] })
        queryClient.invalidateQueries({ queryKey: [EmployeeServices.GET_EMPLOYEE_BY_ID, id] })
      },
      onError: (error) => {
        console.error(error, 'err')
        toast.error(error?.message || "Failed to update employee")
      },
    })

  const useDeleteEmployee = () =>
    useMutation({
      mutationKey: [EmployeeServices.DELETE_EMPLOYEE],
      mutationFn: (id: string) => employeeApi.deleteEmployee(id),
      onSuccess: () => {
        toast.success("Employee deleted successfully")
        queryClient.invalidateQueries({ queryKey: [EmployeeServices.GET_EMPLOYEES] })
      },
      onError: (error) => {
        console.error(error, 'err')
        toast.error(error?.message || "Failed to delete employee")
      },
    })

  const useBulkUploadEmployee = () =>
    useMutation({
      mutationKey: [EmployeeServices.BULK_IMPORT],
      mutationFn: ({ file, onProgress }: { file: File, onProgress?: (progress: number) => void }) => {
        const formData = new FormData();
        formData.append('file', file);
        return employeeApi.bulkUpload(formData, (event) => {
          if (onProgress && event.total) {
            const percentCompleted = Math.round((event.loaded * 100) / event.total);
            onProgress(percentCompleted);
          }
        });
      },
      onSuccess: () => {
        toast.success("Employees imported successfully")
        queryClient.invalidateQueries({ queryKey: [EmployeeServices.GET_EMPLOYEES] })
      },
      onError: (error) => {
        console.error(error, 'err')
        toast.error(error?.message || "Failed to import employees")
      },
    })

  return {
    useGetEmployees,
    useGetEmployeeById,
    useCreateEmployee,
    useUpdateEmployee,
    useDeleteEmployee,
    useBulkUploadEmployee,
    EmployeeServices
  }
}

export default useEmployeeServices
