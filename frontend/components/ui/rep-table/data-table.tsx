"use client"
import * as React from "react"
import { DataTablePagination } from "./pagination"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/ui/rep-table/view-options"

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

function getLowercaseValue(cell: any): string {
  const value = cell.getValue();
  return typeof value === 'string' ? value.toLowerCase() : '';
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    initialState: {
      pagination: {
          pageSize: 15,
      },
    },
  })
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by constituency..."
          value={(table.getColumn("constituency")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("constituency")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DataTableViewOptions table={table} />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers
                    .slice(1)     // Added this to skip the id column from being displaued
                    .map((header) => {
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells()
                    .slice(1)     // Added this to skip the id column from being displayed
                    .map((cell) => (
                    <TableCell key={cell.id}>
                      <a href={row.getVisibleCells().at(5)?.getValue() as string === 'Provincial' ? (
                        `/browse/${getLowercaseValue(row.getVisibleCells().at(3))}/${row.getVisibleCells().at(0)?.getValue() as string }`
                      ) : (
                        `/browse/federal/${row.getVisibleCells().at(0)?.getValue() as string }`
                      ) }>  
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </a>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
