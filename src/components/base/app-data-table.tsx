"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  HeaderContext,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronLeft, ChevronRight, ArrowUp, ArrowDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface AppDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  className?: string
  pageSizeOptions?: number[]
  loading?: boolean
  page?: number
  limit?: number
  total?: number
  onPageChange?: (page: number) => void
  onLimitChange?: (limit: number) => void
  onSortChange?: (sort: string[]) => void
}

export default function AppDataTable<TData, TValue>({
  columns,
  data,
  className,
  pageSizeOptions = [10, 20, 30, 40, 50],
  loading,
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
  onSortChange,
}: AppDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])

  React.useEffect(() => {
    if (onSortChange) {
      const sortParams = sorting.map(
        (sort) => `${sort.id}:${sort.desc ? "desc" : "asc"}`
      )
      onSortChange(sortParams)
    }
  }, [sorting, onSortChange])


  const processedColumns = React.useMemo(() => {
    const newColumns = columns.map((col) => {
      if (!col.header) {
        return col
      }

      const originalHeader = col.header

      return {
        ...col,
        header: (headerContext: HeaderContext<TData, TValue>) => {
          const { column } = headerContext

          if (!column.getCanSort()) {
            return typeof originalHeader === "function"
              ? originalHeader(headerContext)
              : originalHeader
          }

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8 data-[state=open]:bg-accent"
                >
                  {typeof originalHeader === "function"
                    ? originalHeader(headerContext)
                    : originalHeader}
                  {column.getIsSorted() === "desc" ? (
                    <ArrowDown className="ml-2 h-4 w-4" />
                  ) : column.getIsSorted() === "asc" ? (
                    <ArrowUp className="ml-2 h-4 w-4" />
                  ) : (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                  Asc
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                  Desc
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      } as ColumnDef<TData, TValue>
    })

    return newColumns
  }, [columns])

  const coreRowModel = React.useMemo(() => getCoreRowModel(), [])

  const paginationRowModel = React.useMemo(() => getPaginationRowModel(), [])
  const sortedRowModel = React.useMemo(() => getSortedRowModel(), [])

  const pageCount = React.useMemo(() => {
    if (total === undefined || limit === undefined) return -1
    return Math.ceil(total / limit)
  }, [total, limit])

  const tableState = React.useMemo(
    () => ({
      sorting,
      pagination: {
        pageIndex: (page ?? 1) - 1,
        pageSize: limit ?? 10,
      },
    }),
    [sorting, page, limit]
  )

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: processedColumns,
    getCoreRowModel: coreRowModel,
    getPaginationRowModel: paginationRowModel,
    onSortingChange: setSorting,
    getSortedRowModel: sortedRowModel,
    state: tableState,
    manualPagination: !!(page && limit),
    manualSorting: !!onSortChange,
    pageCount: pageCount > 0 ? pageCount : undefined,
  })

  return (
    <div className={cn("space-y-4", className)}>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {processedColumns.map((column, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                if (onLimitChange) {
                  onLimitChange(Number(value))
                } else {
                  table.setPageSize(Number(value))
                }
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => {
                if (onPageChange) {
                  onPageChange((page ?? 1) - 1)
                } else {
                  table.previousPage()
                }
              }}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => {
                if (onPageChange) {
                  onPageChange((page ?? 1) + 1)
                } else {
                  table.nextPage()
                }
              }}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}