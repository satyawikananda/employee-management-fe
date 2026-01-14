"use client"

import AppDataTable from "@/components/base/app-data-table";
import AppPaddingLayout from "@/components/base/app-padding-layout";
import useEmployee from "./_modules/hooks/use-employee";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AppDialog from "@/components/base/app-dialog";
import EmployeeForm from "./_modules/components/employee-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EmployeeBulkImportDialog } from "./_modules/components/employee-bulk-import-dialog";

function DashboardPage() {
  const {
    tableColumns,
    employees,
    employeeLoading,
    pagination,
    setSearch,
    setPagination,
    setSort,
    openEmployee,
    setOpenEmployee,
    searchEmployee,
    selectedEmployeeId,
    setSelectedEmployeeId,
    openDelete,
    setOpenDelete,
    onDeleteConfirm,
    isDeleting,
    openBulkImport,
    setOpenBulkImport,
  } = useEmployee()

  const handleClose = (open: boolean) => {
    setOpenEmployee(open)
    if (!open) {
      setSelectedEmployeeId(undefined)
    }
  }

  return (
    <AppPaddingLayout className="gap-y-10">
      <h1 className="text-3xl font-bold text-accent-foreground">
        Employee Management
      </h1>
      <div className="grid grid-cols-12 gap-10 w-full">
        <div className="flex items-center gap-10 w-full col-span-6">
          <Input
            placeholder="Search employee..."
            className="w-full"
            value={searchEmployee}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4 w-full col-span-6 justify-end">
          <Button
            variant="outline"
            className="w-1/3 cursor-pointer"
            onClick={() => setOpenEmployee(true)}
          >
            Add Employee
          </Button>
          <Button
            variant="outline"
            className="w-1/3 cursor-pointer"
            onClick={() => setOpenBulkImport(true)}
          >
            Import Employee
          </Button>
        </div>
      </div>
      <AppDataTable
        columns={tableColumns}
        data={employees?.data || []}
        loading={employeeLoading}
        pageSizeOptions={[10, 20, 30, 40, 50]}
        total={employees?.pagination.total}
        page={employees?.pagination.currentPage}
        limit={employees?.pagination.limit}
        onPageChange={(page) => setPagination({
          ...pagination,
          page
        })}
        onLimitChange={(limit) => setPagination({
          ...pagination,
          limit
        })}
        onSortChange={(sorts) => setSort(sorts[0] || "")}
      />

      {/* Add Employee Dialog */}
      <AppDialog
        title={selectedEmployeeId ? "Edit Employee" : "Add Employee"}
        description={selectedEmployeeId ? "Edit employee details" : "Add new employee here"}
        open={openEmployee}
        onOpenChange={handleClose}
        className="w-5xl backdrop-blur-lg"
      >
        <EmployeeForm
          employeeId={selectedEmployeeId}
          onSuccess={() => handleClose(false)}
        />
      </AppDialog>

      {/* Delete Employee Dialog */}
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the employee record from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={(e) => {
                e.preventDefault()
                onDeleteConfirm()
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Import Dialog */}
      <EmployeeBulkImportDialog
        open={openBulkImport}
        onOpenChange={setOpenBulkImport}
      />
    </AppPaddingLayout >

  );
}

export default DashboardPage