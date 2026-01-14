import { z } from "zod"

export const employeeRequestSchema = z.object({
  name: z.string().nonempty('Name is required'),
  age: z.number("Age is required").nonnegative("Age must be a non-negative number"),
  position: z.string().nonempty("Position is required"),
  salary: z.number("Salary is required").nonnegative("Salary must be a non-negative number")
})

export type EmployeeRequestSchema = z.infer<typeof employeeRequestSchema>
