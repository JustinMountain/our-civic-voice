import Image from 'next/image';

import { RepInfo } from "@/components/data-layer/interfaces"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { SewingPinIcon, 
          InfoCircledIcon,
          DesktopIcon,
          KeyboardIcon } from "@radix-ui/react-icons"

export default function RepInfo(props: {data: RepInfo}) {
  const level = props.data.govLevel;
  const levelCapitalized = level.charAt(0).toUpperCase() + level.slice(1);
  const sourceDate = new Date(props.data.timeRetrieved);
  const year = sourceDate.getFullYear();
  const month = sourceDate.toLocaleString('default', { month: 'long' });
  const day = sourceDate.getDate().toString().padStart(2, '0');
  const formattedDate = `${year} ${month} ${day}`;

  return (

    <div className="px-4 w-full">
      <Card>
        <div className="md:col-start-1 md:col-end-2 
                        md:row-start-1 md:row-end-3 
                        flex flex-col justify-end">
          <Image
            src={`${props.data.imageUrl}`}
            width={140}
            height={140}
            title={`${props.data.firstName} ${props.data.lastName} headshot`}
            alt={`${props.data.firstName} ${props.data.lastName} headshot`}
            className="mx-auto pt-8" />
        </div>

        <h2 className="text-4xl text-primary text-center px-4 py-8">
          {props.data.firstName} {props.data.lastName}
        </h2>        
        <CardHeader>
          <CardTitle>{props.data.constituency}</CardTitle>
          <CardDescription>{levelCapitalized} Constituency</CardDescription>
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
                {props.data.provinceTerritory}
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
                {props.data.party}
              </p>
            </div>
          </div>

          {/* Email */}
          {props.data.email.length > 0 ? (
            <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
              <div>
                <br />
                <KeyboardIcon className="mt-px h-5 w-5" />
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium ">
                  {props.data.email}
                </p>
              </div>
            </div>
          ) : (
            null
          )}

          {/* Website */}
          {props.data.website.length > 0 ? (
            <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
              <div>
                <br />
                <DesktopIcon className="mt-px h-5 w-5" />
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Website</p>
                <p className="font-medium ">
                  {props.data.website}
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

// honorific
