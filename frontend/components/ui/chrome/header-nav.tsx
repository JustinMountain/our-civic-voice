import React from "react";
import { Button } from "@/components/ui/button"

export default function NavMain() {

  let mainButtonColor = "";

  const navLinks = [
    {name:"Home", href:"/", color:mainButtonColor},
    {name:"Documentation", href:"/projects", color:mainButtonColor},
    {name:"Connect", href:"/connect", color:"accent"},
  ]

  const navHtml = navLinks.map((link, index) => (
    <li key={index} className="text-right flex justify-end py-12 pr-6 
                                md:pl-4 md:pr-0 md:py-2 md:mr-8 md:last:mr-0">
      {/* <Button content={link.name} buttonType={link.color} /> */}
    </li>
  ));

  return (
    <nav>
      <ul className="justify-center 
                      md:justify-end md:flex">
        {navHtml}
      </ul>
    </nav>
  );
};