"use client"

import { RepColumns } from "@/components/ui/rep-table/columns"
import { getDataForRepTable } from "@/components/ui/rep-table/rep-table";
import OfficeCardStack from "@/components/ui/contact/office-card-stack/office-card-stack";
import HeroComponent from "@/components/ui/hero/hero";
import RepInfo from "@/components/ui/hero/rep-info";
import Footer from "@/components/ui/chrome/footer";

import { OfficeInfo, getDataForOfficeInfo } from "@/components/ui/contact/office-card-stack/office-info";

import { FEDERAL_REPRESENTATIVE_ENDPOINT } from "@/config/constants";
import { FEDERAL_OFFICE_ENDPOINT } from "@/config/constants";

export default async function Page({ params }: { params: { slug: string } }) {
  const slug = { params }.params.slug;
  
  const repData: RepColumns[] = await getDataForRepTable(`${FEDERAL_REPRESENTATIVE_ENDPOINT}${slug}`);
  const officeData: OfficeInfo[] = await getDataForOfficeInfo(`${FEDERAL_OFFICE_ENDPOINT}${slug}`);

  return (
    <div className="container mx-auto p-0">

      <HeroComponent title={repData[0].name}>
        <RepInfo data={repData} />
      </HeroComponent>

      <OfficeCardStack data={officeData} />

      <Footer />
    </div>
  )
}
