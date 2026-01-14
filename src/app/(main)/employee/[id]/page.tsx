"use client"

import { useParams, useRouter } from "next/navigation"
import useEmployeeServices from "@/lib/api/employee/use-employee.api"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AppPaddingLayout from "@/components/base/app-padding-layout"
import { formatPrice } from "@/lib/utils"

export default function EmployeeDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { useGetEmployeeById } = useEmployeeServices()
  const { data: employee, isLoading, error } = useGetEmployeeById(id as string)

  if (isLoading) {
    return <div className="flex h-full items-center justify-center p-8">Loading...</div>
  }

  if (error || !employee?.data) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
        <p className="text-destructive">Failed to load employee details.</p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    )
  }

  const { data } = employee

  return (
    <AppPaddingLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Employee Details</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Full Name</span>
              <p className="text-lg font-medium">{data.name}</p>
            </div>

            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Position</span>
              <p className="text-lg">{data.position}</p>
            </div>

            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Age</span>
              <p className="text-lg">{data.age} years old</p>
            </div>

            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Salary</span>
              <p className="text-lg">
                {formatPrice(data.salary)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppPaddingLayout>
  )
}
