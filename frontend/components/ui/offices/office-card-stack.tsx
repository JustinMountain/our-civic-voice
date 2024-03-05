import OfficeCard from "@/components/ui/offices/office-card";

import { OfficeInfo } from "@/components/data-layer/interfaces";

export default async function OfficeCardStack(props: {data: OfficeInfo[]}) {
  return (
    <div className="container flex flex-col justify-start py-8 gap-4
                    md:grid md:grid-cols-2 md:gap-8 md:py-16 md:justify-start">
      {props.data.map((officeInfo, index) => (
        <OfficeCard key={officeInfo.officeId || index} data={officeInfo} />
      ))}
    </div>
  )
}
