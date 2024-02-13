import React from 'react';
import { useState } from "react";
import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

export default function Header() {

  const [btnState, setBtnState] = useState(false);
  let buttonAddClass = btnState ? '': 'hidden';

  function handleClick() {
    setBtnState(btnState => !btnState);
  };
  
  const browse: { title: string; href: string }[] = [
    {
      title: "Federal",
      href: "/browse/federal",
    },
    {
      title: "Ontario",
      href: "/browse/ontario",
    },
    {
      title: "All",
      href: "/browse",
    }
  ]

  return (
    <header className="bg-primary top-0" id="top">
      <h1 className="sr-only">Our Civic Voice</h1>
      <div className='flex flex-row justify-end px-4 py-6 max-w-7xl m-auto text-lg text-light
                      md:px-8
                      xl:py-8'>
          <NavigationMenu>
            <NavigationMenuList>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Connect
                </NavigationMenuLink>
              </Link>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Browse</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="gap-3 p-4 w-48">
                    {browse.map((item) => (
                      <ListItem
                        key={item.title}
                        title={item.title}
                        href={item.href}
                      >
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
    </header>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
