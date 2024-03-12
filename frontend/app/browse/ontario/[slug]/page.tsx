"use client"

import { getRepInfo } from "@/components/data-layer/get-representatives";
import { getOfficeInfo } from "@/components/data-layer/get-offices";

import OfficeCardStack from "@/components/ui/offices/office-card-stack";
import HeroComponent from "@/components/ui/hero/hero";
import RepInfo from "@/components/ui/hero/rep-info";
import Footer from "@/components/ui/chrome/footer";

import { ONTARIO_REPRESENTATIVE_ENDPOINT } from "@/config/constants";
import { ONTARIO_OFFICE_ENDPOINT } from "@/config/constants";

export default async function Page({ params }: { params: { slug: string } }) {
  const slug = { params }.params.slug;

  const repData = await getRepInfo(`${ONTARIO_REPRESENTATIVE_ENDPOINT}${slug}`);
  const officeData = await getOfficeInfo(`${ONTARIO_OFFICE_ENDPOINT}${slug}`);

  let name = `${repData[0].firstName} ${repData[0].lastName}`;

  if (repData[0].honorific.length > 0) {
    name = `${repData[0].honorific} ${name}`;
  }

  return (
    <div className="mx-auto p-0">
      <HeroComponent title={``}>
        <RepInfo data={repData[0]} />
      </HeroComponent>

      <OfficeCardStack data={officeData} name={name} />

      <Footer />
    </div>
  )
}
