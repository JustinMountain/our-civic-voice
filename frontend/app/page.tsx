"use client"

import { RepColumns } from "@/components/ui/rep-table/columns"
import { getDataForRepTable } from "@/components/ui/rep-table/rep-table";
import RepTable from "@/components/ui/rep-table/rep-table";
import { ALL_REPRESENTATIVE_ENDPOINT } from "@/config/constants";
import { ModeToggle } from "@/components/ui/mode-toggle"
import Header from "@/components/ui/chrome/header"

export default async function Representatives() {
  const data: RepColumns[] = await getDataForRepTable(ALL_REPRESENTATIVE_ENDPOINT)

  return (
    <div className="container mx-auto p-0">
      <Header />
      <ModeToggle />
      <RepTable data={data} />
    </div>
  )
}
