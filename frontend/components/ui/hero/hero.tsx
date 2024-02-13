import React from 'react';
import Image from 'next/image';
import Header from "@/components/ui/chrome/header";

interface HeroProps {
  title: string;
  children?: React.ReactNode;
}

const HeroComponent: React.FC<HeroProps> = ({ title, children }) => {
  return (
    <section className='bg-primary m-auto
                        md:text-left'>
      <div className="container p-0 mx-auto
                        md:grid md:grid-cols-2 align-start
                        ">
        <div className="md:row-start-1 md:row-end-2
                        md:col-start-2 md:col-end-3">
          <Header />
        </div>

        <div className="max-w-lg mx-auto 
                        md:row-start-2 md:row-end-3
                        md:col-start-2 md:col-end-3 md:max-w-xl">
          <h2 className="text-5xl text-light text-center px-4 pt-4 pb-8
                        md:pt-0">
            {title}
          </h2>
          <div className="pb-8">
            {children}
          </div>
        </div>

        <div className="md:col-start-1 md:col-end-2 
                        md:row-start-1 md:row-end-3 
                        flex flex-col justify-end">
          <Image
            src="/leaf.png"
            width={660}
            height={660}
            title="Justin"
            alt="Justin"
            className="align-left align-bottom md:pt-8" />
        </div>
        
      </div>
    </section>
  )
}

export default HeroComponent;
