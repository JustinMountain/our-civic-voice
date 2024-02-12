import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ModeToggle } from '@/components/ui/mode-toggle';

export default function Footer() {
  return (
    <footer className="bg-primary text-light">
      <div className="container p-0
                      md:flex md:flex-row-reverse md:justify-between md:gap-4">
        <div className="flex flex-col mx-auto 
                        md:mx-0 md:justify-center">
          <p className="text-lg p-4">
            Check out the source code on <Link href="https://github.com/JustinMountain/our-civic-voice">GitHub</Link>.
            
          </p>
          <p className="text-foreground text-right pr-4"> 
            <ModeToggle />
          </p>
        </div>
        <div className="
                        md:w-64">
          <Image
              src="/leaf.png"
              width={256}
              height={256}
              title="Justin"
              alt="Justin"
              className="pt-8 md:w-64"
          />    
        </div>

      </div>
    </footer>
  );
};
