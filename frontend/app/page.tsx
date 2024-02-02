import { RepColumns } from "@/components/ui/rep-table/columns"
import { getDataForRepTable } from "@/components/ui/rep-table/rep-table";
import RepTable from "@/components/ui/rep-table/rep-table";
import { ALL_REPRESENTATIVE_ENDPOINT } from "@/config/constants";

export default async function Representatives() {
  const data: RepColumns[] = await getDataForRepTable(ALL_REPRESENTATIVE_ENDPOINT)

  return (
    <div className="container mx-auto py-10">
      <RepTable data={data} />
    </div>
  )
}
