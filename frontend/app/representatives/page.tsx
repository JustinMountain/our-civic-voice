import { RepColumns } from "@/components/ui/rep-table/columns"
import { getDataForRepTable } from "@/components/ui/rep-table/rep-table";
import RepTable from "@/components/ui/rep-table/rep-table";

const REPRESENTATIVE_ENDPOINT = 'representatives/';

export default async function Representatives() {
  const data: RepColumns[] = await getDataForRepTable(REPRESENTATIVE_ENDPOINT)

  return (
    <div className="container mx-auto py-10">
      <RepTable data={data} />
    </div>
  )
}
