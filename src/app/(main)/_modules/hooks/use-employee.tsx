import AppTableActions from "@/components/base/app-table-action";
import { ColumnDef } from "@tanstack/react-table"
import { useRouter } from "next/navigation";
import { format } from "date-fns"
import { formatPrice } from "@/lib/utils";
import useEmployeeServices from "@/lib/api/employee/use-employee.api";
import { useState } from "react";

export default function useEmployee() {
  const router = useRouter()
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | undefined>(undefined)

  const columns: ColumnDef<EmployeeResponse, unknown>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'age',
      header: 'Age',
    },
    {
      accessorKey: 'position',
      header: 'Position',
    },
    {
      accessorKey: 'salary',
      header: 'Salary',
      cell: ({ row }) => (
        <span>{formatPrice(row.original.salary)}</span>
      )
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => (
        <span>{format(new Date(row.original.createdAt), 'eeee, dd MMMM yyyy')}</span>
      )
    },
    {
      id: 'action',
      accessorKey: "action",
      header: 'Actions',
      enableSorting: false,
      cell: ({ row }) => (
        <AppTableActions
          onEdit={() => {
            setSelectedEmployeeId(row.original.id)
            setOpenEmployee(true)
          }}
          onDelete={() => {
            setDeleteId(row.original.id)
            setOpenDelete(true)
          }}
          onDetail={() => router.push(`/employee/${row.original.id}`)}
        />
      )
    }
  ]

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalData: 10,
    limit: 10
  });
  const [search, setSearch] = useState("")
  const [openEmployee, setOpenEmployee] = useState(false)
  const [openBulkImport, setOpenBulkImport] = useState(false)
  const [sort, setSort] = useState<string>("")

  const { useGetEmployees, useDeleteEmployee } = useEmployeeServices()
  const { data: employees, isLoading: employeeLoading } = useGetEmployees({
    page: pagination.page,
    limit: pagination.limit,
    ...(search ? { search } : {}),
    ...(sort ? { sort } : {})
  })

  const { mutate: deleteEmployee, isPending: isDeleting } = useDeleteEmployee()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [openDelete, setOpenDelete] = useState(false)

  const onDeleteConfirm = () => {
    if (deleteId) {
      deleteEmployee(deleteId, {
        onSuccess: () => setOpenDelete(false)
      })
    }
  }

  return {
    tableColumns: columns,
    pagination,
    setSearch,
    setPagination,
    setSort,
    openEmployee,
    setOpenEmployee,
    employees,
    employeeLoading,
    searchEmployee: search,
    selectedEmployeeId,
    setSelectedEmployeeId,
    openDelete,
    setOpenDelete,
    onDeleteConfirm,
    isDeleting,
    openBulkImport,
    setOpenBulkImport,
  }
}