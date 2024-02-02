"use client"
 
import { ColumnDef } from "@tanstack/react-table"



export type RepColumns = {
  member_id: string,
  name: string,
  constituency: string,
  province_territory: string,
  party: string,
  gov_level: string,
}

export const columns: ColumnDef<RepColumns>[] = [
  {
    accessorKey: "member_id",
    header: "member_id",
  },
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
