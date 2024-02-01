import OfficeCard from "@/components/ui/contact/office-card-stack/office-card";
import { OfficeInfo } from "@/components/ui/contact/office-card-stack/office-info";

export default async function OfficeCardStack(props: {data: OfficeInfo[]}) {
  return (
    <>
      {props.data.map((officeInfo, index) => (
        <OfficeCard key={officeInfo.office_id || index} data={officeInfo} />
      ))}
    </>
  )
}
