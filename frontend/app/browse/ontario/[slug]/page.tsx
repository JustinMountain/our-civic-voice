"use client"

import { getRepInfo } from "@/components/data-layer/get-representatives";

// import { RepTableColumns } from "@/components/data-layer/interfaces";
// import { getDataForRepTable } from "@/components/data-layer/rep-table";
import OfficeCardStack from "@/components/ui/contact/office-card-stack/office-card-stack";
import HeroComponent from "@/components/ui/hero/hero";
import RepInfo from "@/components/ui/hero/rep-info";
import Footer from "@/components/ui/chrome/footer";

import { OfficeInfo, getDataForOfficeInfo } from "@/components/ui/contact/office-card-stack/office-info";

import { ONTARIO_REPRESENTATIVE_ENDPOINT } from "@/config/constants";
import { ONTARIO_OFFICE_ENDPOINT } from "@/config/constants";

export default async function Page({ params }: { params: { slug: string } }) {
  const slug = { params }.params.slug;

  const repInfo = await getRepInfo(`${ONTARIO_REPRESENTATIVE_ENDPOINT}${slug}`);
  
  // const repData: RepTableColumns[] = await getDataForRepTable(`${ONTARIO_REPRESENTATIVE_ENDPOINT}${slug}`);
  const officeData: OfficeInfo[] = await getDataForOfficeInfo(`${ONTARIO_OFFICE_ENDPOINT}${slug}`);

  return (
    <div className="mx-auto p-0">
      <HeroComponent title={`${repInfo[0].firstName} ${repInfo[0].lastName}`}>
        <RepInfo data={repInfo} />
      </HeroComponent>

      <OfficeCardStack data={officeData} />

      <Footer />
    </div>
  )
}
