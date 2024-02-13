import { RepColumns } from "@/components/ui/rep-table/columns"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SewingPinIcon, InfoCircledIcon } from "@radix-ui/react-icons"


export default function RepInfo(props: {data: RepColumns[]}) {
  const level = props.data[0].gov_level
  const levelCapitalized = level.charAt(0).toUpperCase() + level.slice(1)

  return (

    <div className="px-4">
      <Card>
        <CardHeader>
          <CardDescription>{levelCapitalized} Constituency</CardDescription>
          <CardTitle>{props.data[0].constituency}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-1">
          <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
            <div>
              <br />
              <SewingPinIcon className="mt-px h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Province / Territory
              </p>
              <p className="font-medium ">
                {props.data[0].province_territory}
              </p>
            </div>
          </div>
          <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
            <div>
              <br />
              <InfoCircledIcon className="mt-px h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Affiliation
              </p>
              <p className="font-medium ">
                {props.data[0].party}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
