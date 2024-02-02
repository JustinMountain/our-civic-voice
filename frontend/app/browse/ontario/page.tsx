import { RepColumns } from "@/components/ui/rep-table/columns"
import { getDataForRepTable } from "@/components/ui/rep-table/rep-table";
import RepTable from "@/components/ui/rep-table/rep-table";
import { ONTARIO_REPRESENTATIVE_ENDPOINT } from "@/config/constants";

export default async function OntarioRepresentatives() {
  const data: RepColumns[] = await getDataForRepTable(ONTARIO_REPRESENTATIVE_ENDPOINT)

  return (
    <div className="container mx-auto py-10">
      <RepTable data={data} />
    </div>
  )
}
