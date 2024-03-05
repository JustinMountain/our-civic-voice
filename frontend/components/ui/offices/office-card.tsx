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

import { EnvelopeClosedIcon, 
          FileTextIcon, 
          BellIcon, 
          RocketIcon, 
          DesktopIcon, 
          MagicWandIcon } from "@radix-ui/react-icons"

export default async function OfficeCard(props: {data: OfficeInfo}) {
  const sourceDate = new Date(props.data.timeRetrieved);
  const year = sourceDate.getFullYear();
  const month = sourceDate.toLocaleString('default', { month: 'long' });
  const day = sourceDate.getDate().toString().padStart(2, '0');
  const formattedDate = `${year} ${month} ${day}`;
  const addressSplit = props.data.officeAddress.split('\n');

  return (
    <div className="grow w-11/12">
      <Card>
        <CardHeader>
          <CardTitle>{props.data.officeType}</CardTitle>
          {/* <CardDescription>{props.data.officeEmail}</CardDescription> */}
        </CardHeader>
        <CardContent className="grid gap-1">
          <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
            <div>
              <br />
              <EnvelopeClosedIcon className="mt-px h-5 w-5" />
            </div>

            {/* Mailing Address */}
            <div className="space-y-1">
              
              <p className="text-sm text-muted-foreground">Mailing Address</p>
              <p className="font-medium ">

              {props.data.officeTitle.length > 0 ? (
                <>
                  {props.data.officeTitle}
                  <br />
                </>              
              ) : (
                null
              )}
              {addressSplit.length > 0 && addressSplit[0].length > 0? (
                addressSplit.map((line, index, array) => (
                  <React.Fragment key={index}>
                    {line}
                    {/* Add <br /> after each line except the last one */}
                    {index < array.length && <br />}
                  </React.Fragment>
                ))
              ) : (
                null
              )}    
                {props.data.officeCity}, {props.data.officeProvinceTerritory}<br />
                {props.data.officePostalCode}
              </p>
            </div>
          </div>

          {props.data.officeNote.length > 0 ? (
            <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
              <div className="pl-8 space-y-1">
                <p className="font-medium ">
                  {props.data.officeNote}
                </p>
              </div>
            </div>
          ) : (
            null
          )}

          {/* Phone Number */}
          {props.data.officeTelephone.length > 0 ? (
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
          ) : (
            null
          )}

          {/* Fax Number */}
          {props.data.officeFax.length > 0 ? (
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
          ) : (
            null
          )}

          {/* Email */}
          {props.data.officeEmail.length > 0 ? (
            <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
              <div>
                <br />
                <DesktopIcon className="mt-px h-5 w-5" />
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium ">
                  {props.data.officeEmail}
                </p>
              </div>
            </div>
          ) : (
            null
          )}

          {/* Toll Free */}
          {props.data.officeTollFree.length > 0 ? (
            <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
            <div>
              <br />
              <RocketIcon className="mt-px h-5 w-5" />
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Office Toll Free</p>
              <p className="font-medium ">
                {props.data.officeTollFree}
              </p>
            </div>
          </div>
          ) : (
            null
          )}

          {/* TTY */}
          {props.data.officeTty.length > 0 ? (
            <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
              <div>
                <br />
                <MagicWandIcon className="mt-px h-5 w-5" />
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Office TTY</p>
                <p className="font-medium ">
                  {props.data.officeTty}
                </p>
              </div>
            </div>
          ) : (
            null
          )}

          {/* Source */}
          <div className="text-right">
            <Popover>
              <PopoverTrigger>
                <p className="text-sm text-muted-foreground">
                  Source
                </p>
              </PopoverTrigger>
              <PopoverContent className="w-fit text-sm">
                Updated: {formattedDate}<br />
                <div className="text-right">
                  <a href={props.data.sourceUrl} className="underline">Link</a>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
