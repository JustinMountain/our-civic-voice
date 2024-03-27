import { RepTableColumns } from "@/components/ui/rep-table/columns"
import { RepInfo, Concern } from "@/components/data-layer/interfaces"
import { getRepInfo } from "@/components/data-layer/get-representatives"
import { ALL_REPRESENTATIVE_ENDPOINT } from "@/config/constants";



async function getDataConcernForm(): Promise<RepTableColumns[]> {
  try {
    const repArray: RepTableColumns[] = [];
    const allReps = await getRepInfo(ALL_REPRESENTATIVE_ENDPOINT);

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
    console.error(`Could not GET from /${ALL_REPRESENTATIVE_ENDPOINT}`);
    throw error; 
  }
}

export default function ConcernSelect() {
  
}