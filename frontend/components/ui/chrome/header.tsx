import React from 'react';
import { useState } from "react";
import Link from 'next/link';

export default function Header() {

  const [btnState, setBtnState] = useState(false);
  let buttonAddClass = btnState ? '': 'hidden';

  function handleClick() {
    setBtnState(btnState => !btnState);
  };
  

  return (
    <header className="bg-primary top-0" id="top">
      <div className='flex flex-col px-4 py-6 max-w-7xl m-auto text-lg
                      md:flex-row md:px-8
                      xl:py-8
                      2xl:px-0'>
        <div className="flex my-auto justify-between 
                        md:w-1/2 md:justify-start">
          <div>
            <h1 className='control-link-color'>
              <Link href="/">
                Our Civic Voice
              </Link>
            </h1>
          </div>
          <button 
            className='my-auto justify-end 
                        md:hidden'
            onClick={handleClick}>
            <div>
              <div className='bg-light w-12 h-0.5 my-1'></div>
              <div className='bg-light w-12 h-0.5 my-1'></div>
              <div className='bg-light w-12 h-0.5 my-1'></div>
            </div>
          </button> 
        </div>
        <div className={`justify-end absolute w-screen top-16 right-0 pb-8
                          md:flex md:w-1/2 md:static md:bg-transparent md:pr-0 md:pb-0 ${buttonAddClass}`}>
          {/* <MainNav color={color} /> */}
        </div>
      </div>
    </header>
  );
};