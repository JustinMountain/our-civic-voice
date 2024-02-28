"use client"

import { getRepInfo } from "@/components/data-layer/get-representatives";

import OfficeCardStack from "@/components/ui/contact/office-card-stack/office-card-stack";
import HeroComponent from "@/components/ui/hero/hero";
import RepInfo from "@/components/ui/hero/rep-info";
import Footer from "@/components/ui/chrome/footer";

import { OfficeInfo, getDataForOfficeInfo } from "@/components/ui/contact/office-card-stack/office-info";

import { ONTARIO_REPRESENTATIVE_ENDPOINT } from "@/config/constants";
import { ONTARIO_OFFICE_ENDPOINT } from "@/config/constants";

export default async function Page({ params }: { params: { slug: string } }) {
  const slug = { params }.params.slug;

  const repData = await getRepInfo(`${ONTARIO_REPRESENTATIVE_ENDPOINT}${slug}`);
  const officeData: OfficeInfo[] = await getDataForOfficeInfo(`${ONTARIO_OFFICE_ENDPOINT}${slug}`);

  return (
    <div className="mx-auto p-0">
      <HeroComponent title={`${repData[0].firstName} ${repData[0].lastName}`}>
        <RepInfo data={repData[0]} />
      </HeroComponent>

      <OfficeCardStack data={officeData} />

      <Footer />
    </div>
  )
}
