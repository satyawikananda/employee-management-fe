"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import useEmployeeServices from "@/lib/api/employee/use-employee.api"
import { employeeRequestSchema, EmployeeRequestSchema } from "@/shared/schemas/employee.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface EmployeeFormProps {
  employeeId?: string
  onSuccess?: () => void
}

function EmployeeForm({ employeeId, onSuccess }: EmployeeFormProps) {
  const { useCreateEmployee, useUpdateEmployee, useGetEmployeeById } = useEmployeeServices()

  const { data: employee } = useGetEmployeeById(employeeId || '')
  const { mutateAsync: createEmployee, isPending: isCreating } = useCreateEmployee()
  const { mutateAsync: updateEmployee, isPending: isUpdating } = useUpdateEmployee()

  const form = useForm<EmployeeRequestSchema>({
    resolver: zodResolver(employeeRequestSchema),
    defaultValues: {
      name: "",
      age: 0,
      position: "",
      salary: 0,
    },
  })

  useEffect(() => {
    if (employee) {
      form.reset({
        name: employee.data.name,
        age: employee.data.age,
        position: employee.data.position,
        salary: employee.data.salary,
      })
    }
  }, [employee, form])

  const onSubmit = async (values: EmployeeRequestSchema) => {
    try {
      if (employeeId) {
        await updateEmployee({ id: employeeId, data: values })
      } else {
        await createEmployee(values)
      }
      onSuccess?.()
    } catch {
      // Error is handled by the mutation hook (toast)
      toast.error("Failed to create employee")
    }
  }

  const isLoading = isCreating || isUpdating

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="30"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position</FormLabel>
              <FormControl>
                <Input placeholder="Software Engineer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="salary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Salary</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="5000"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default EmployeeForm