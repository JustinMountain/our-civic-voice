import { RepColumns } from "@/components/ui/rep-table/columns"
import { getDataForRepTable } from "@/components/ui/rep-table/rep-table";
import RepTable from "@/components/ui/rep-table/rep-table";
import OfficeCardStack from "@/components/ui/office-card-stack/office-card-stack";

import { OfficeInfo, getDataForOfficeInfo } from "@/components/ui/office-card-stack/office-info";

import { FEDERAL_REPRESENTATIVE_ENDPOINT } from "@/config/constants";
import { FEDERAL_OFFICE_ENDPOINT } from "@/config/constants";

export default async function Page({ params }: { params: { slug: string } }) {
  const slug = { params }.params.slug;
  
  const repData: RepColumns[] = await getDataForRepTable(`${FEDERAL_REPRESENTATIVE_ENDPOINT}${slug}`);
  const officeData: OfficeInfo[] = await getDataForOfficeInfo(`${FEDERAL_OFFICE_ENDPOINT}${slug}`);

  return (
    <div className="container mx-auto py-10">
      <RepTable data={repData} />
      <OfficeCardStack data={officeData} />
    </div>
  )
}
