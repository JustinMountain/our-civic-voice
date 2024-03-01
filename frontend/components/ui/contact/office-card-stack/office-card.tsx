import React from "react";
import { OfficeInfo } from "@/components/data-layer/interfaces";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { EnvelopeClosedIcon, FileTextIcon, BellIcon } from "@radix-ui/react-icons"

export default async function OfficeCard(props: {data: OfficeInfo}) {
  const sourceDate = new Date(props.data.timeRetrieved);
  const year = sourceDate.getFullYear();
  const month = sourceDate.toLocaleString('default', { month: 'long' });
  const day = sourceDate.getDate().toString().padStart(2, '0');
  const formattedDate = `${year} ${month} ${day}`;

  return (
    <div className="grow w-11/12
                    ">

      <Card>
        <CardHeader>
          <CardTitle>{props.data.officeType}</CardTitle>
          <CardDescription>{props.data.officeEmail}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-1">
          <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
            <div>
              <br />
              <EnvelopeClosedIcon className="mt-px h-5 w-5" />
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Mailing Address</p>
              <p className="font-medium ">
              {props.data.officeAddress.split('\n').map((line, index, array) => (
                <React.Fragment key={index}>
                  {line}
                  {/* Add <br /> after each line except the last one */}
                  {index < array.length - 1 && <br />}
                </React.Fragment>
              ))}
              <br />
                {props.data.officeCity}, {props.data.officeProvinceTerritory}<br />
                {props.data.officePostalCode}
              </p>
            </div>
          </div>
          <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
            <div>
              <br />
              <BellIcon className="mt-px h-5 w-5" />
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium ">
                {props.data.officeTelephone}
              </p>
            </div>
          </div>
          <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
            <div>
              <br />
              <FileTextIcon className="mt-px h-5 w-5" />
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Fax</p>
              <p className="font-medium ">
                {props.data.officeFax}
              </p>
            </div>
          </div>
          <div className="text-right">
            <Popover>
              <PopoverTrigger>
                <p className="text-sm text-muted-foreground">
                  Source
                </p>
              </PopoverTrigger>
              <PopoverContent>Updated: {formattedDate}</PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
