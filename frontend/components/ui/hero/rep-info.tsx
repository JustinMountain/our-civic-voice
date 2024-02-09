import { RepColumns } from "@/components/ui/rep-table/columns"



export default function RepInfo(props: {data: RepColumns[]}) {

  return (
    <div className="text-light
                    px-4 md:px-0">
      <p>Constituency: {props.data[0].constituency}</p>
      <p>Province/Territory: {props.data[0].province_territory}</p>
      <p>Political Affiliation: {props.data[0].party}</p>
      <p>Government Level: {props.data[0].gov_level}</p>
    </div>

  )
}
