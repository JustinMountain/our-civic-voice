import { RepColumns, columns } from "./columns"
import { DataTable } from "./data-table"
import { REST_API_URL } from "@/config/constants";

interface Representative {
  member_id: string,
  honorific: string,
  first_name: string,
  last_name: string,
  constituency: string,
  party: string,
  province_territory: string,
  gov_level: string,
}

export async function getDataForRepTable(path: string): Promise<RepColumns[]> {
  const url = `${REST_API_URL}/${path}`;

  try {
    const repArray: RepColumns[] = [];
    const res = await fetch(url);
    const json = await res.json();

    // For each row, adapt to the columns interface
    json.forEach((row: Representative) => {
      const thisRep: RepColumns = {
        member_id: `${row.member_id}`,
        name: `${row.first_name} ${row.last_name}`,
        constituency: `${row.constituency}`,
        province_territory: `${row.province_territory}`,
        party: `${row.party}`,
        gov_level: `${row.gov_level}`,
      }
      repArray.push(thisRep);
    });

    return repArray;
  } catch (error) {
    console.error(`Could not GET from ${REST_API_URL}/${path}`);
    throw error; 
  }
}

export default async function RepTable(props: {data: RepColumns[]}) {
  return (
    <div className="max-w-7xl p-4 mx-auto py-10">
      <DataTable columns={columns} data={props.data} />
    </div>
  )
}
