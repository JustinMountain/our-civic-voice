"use client"
 
import { ColumnDef } from "@tanstack/react-table"

export type RepColumns = {
  name: string,
  constituency: string,
  province_territory: string,
  party: string,
  gov_level: string,
}

export const columns: ColumnDef<RepColumns>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "constituency",
    header: "Constituency",
  },
  {
    accessorKey: "province_territory",
    header: "Province/Territory",
  },
  {
    accessorKey: "party",
    header: "Political Affiliation",
  },
  {
    accessorKey: "gov_level",
    header: "Level of Government",
  },
]
