import { columns } from "./columns"
import { DataTable } from "./data-table"
import { RepTableColumns } from "./columns"
import { RepInfo } from '../../data-layer/interfaces';
import { getRepInfo } from "@/components/data-layer/get-representatives"

async function getDataForRepTable(path: string): Promise<RepTableColumns[]> {
  try {
    const repArray: RepTableColumns[] = [];
    const allReps = await getRepInfo(path);

    // For each row, adapt to the columns interface
    allReps.forEach((row: RepInfo) => {
      const thisRep: RepTableColumns = {
        member_id: `${row.memberId}`,
        name: `${row.firstName} ${row.lastName}`,
        constituency: `${row.constituency}`,
        province_territory: `${row.provinceTerritory}`,
        party: `${row.party}`,
        gov_level: `${row.govLevel}`,
      }
      repArray.push(thisRep);
    });

    return repArray;
  } catch (error) {
    console.error(`Could not GET from /${path}`);
    throw error; 
  }
}

export default async function RepTable(props: {path: string}) {
  const data = await getDataForRepTable(props.path);

  return (
    <div className="max-w-7xl p-4 mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
