import { OfficeInfo } from "@/components/ui/office-card-stack/office-info";

export default async function OfficeCard(props: {data: OfficeInfo}) {
  return (
    <div className="container mx-auto py-10">
      <p>Email: {props.data.general_email}</p>
      <p>Office Type: {props.data.office_type}</p>
      <p>Office Address: {props.data.office_address}</p>
      <p>City: {props.data.office_city}</p>
      <p>Province: {props.data.office_province}</p>
      <p>Postal Code: {props.data.office_postal_code}</p>
      <p>Telephone: {props.data.office_telephone}</p>
      <p>Fax: {props.data.office_fax}</p>
      <p>Last Updated: {props.data.updated_date}</p>
    </div>
  )
}
