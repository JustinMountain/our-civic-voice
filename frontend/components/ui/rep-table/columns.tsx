"use client"
 
import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "./column-header"

export type RepTableColumns = {
  member_id: string,
  name: string,
  constituency: string,
  province_territory: string,
  party: string,
  gov_level: string,
}

export const columns: ColumnDef<RepTableColumns>[] = [
  {
    accessorKey: "member_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="member_id" />
    ),
  },
  {
    accessorKey: "constituency",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Constituency" />
    ),
  },
  {
    accessorKey: "province_territory",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Province/Territory" />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "party",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Political Affiliation" />
    ),
  },
  {
    accessorKey: "gov_level",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Government Level" />
    ),
  },
]
