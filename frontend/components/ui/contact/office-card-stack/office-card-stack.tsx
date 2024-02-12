import OfficeCard from "@/components/ui/contact/office-card-stack/office-card";
import { OfficeInfo } from "@/components/ui/contact/office-card-stack/office-info";

export default async function OfficeCardStack(props: {data: OfficeInfo[]}) {
  return (
    <div className="container flex flex-col items-center py-8
                    md:grid md:grid-cols-2 md:gap-4 md:justify-between md:place-items-center">
      {props.data.map((officeInfo, index) => (
        <OfficeCard key={officeInfo.office_id || index} data={officeInfo} />
      ))}
    </div>
  )
}
