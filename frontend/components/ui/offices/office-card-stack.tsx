import OfficeCard from "@/components/ui/offices/office-card";

import { OfficeInfo } from "@/components/data-layer/interfaces";

export default async function OfficeCardStack(props: {data: OfficeInfo[], name: string}) {
  return (
    <div className="container flex flex-col justify-start py-8 px-0 gap-4
                    md:grid md:grid-cols-2 md:gap-16 md:py-16 md:justify-start">
      {props.data.map((officeInfo, index) => (
        <OfficeCard key={officeInfo.officeId || index} data={officeInfo} name={props.name} />
      ))}
    </div>
  )
}
