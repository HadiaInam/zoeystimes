'use client'
import React, { useContext, useEffect } from 'react'
import {AppContext} from "@/context/AppContext";
import { redirect } from 'next/navigation';

const Navbar = () => {

  const {theme, setTheme} = useContext(AppContext)

  const logoMap: Record<string, string> = {
  'chicky-choo': '/chicky-logo.png',
  'beary-cute': '/beary-logo.png', 
  'mochi': '/mochi-logo.png',
  'caths': '/caths-logo.png',
};

const bgMap: Record<string, string> = {
  'chicky-choo': 'bg-white',
  'beary-cute': 'bg-[url(/beary-bg.png)]', 
  'mochi': 'bg-[#F8FFE6]',            
  'caths': 'bg-[url(/caths-bg.jpg)]', 
};

  return (
    <div className={`flex justify-between items-center mx-3 mt-3 `}>
      <div className={`${bgMap[theme]} inset-0 object-cover fixed -z-100`}></div>

      {/* ----------- LOGO ------------- */}
      <div>
  <img 
    src={logoMap[theme]} 
    className="lg:h-26 md:h-22 cursor-pointer"
    alt={`${theme} logo`}
    onClick={() => redirect('/')}
  />
</div>

      {/* ----------- THEMES ---------- */}
      <div className={`flex gap-5 items-center mr-3 `}>

        <div className="flex flex-col items-center">
          <img src={'/chicky-nav.png'} className='h-10 cursor-pointer hover:animate-spin' alt="" onClick={()=> setTheme('chicky-choo')} />
          <div className="text-sm">Chicky-choo</div>
        </div>

         <div className="flex flex-col items-center">
          <img src={'/beary-nav.png'} className='h-10 cursor-pointer hover:animate-spin' alt="" onClick={()=> setTheme('beary-cute')} />
          <div className="text-sm">Beary-cute</div>
        </div>

        <div className="flex flex-col items-center">
          <img src={'/mochi-nav.png'} className='h-10 cursor-pointer hover:animate-spin' alt="" onClick={()=> setTheme('mochi')} />
          <div className="text-sm">Mochi</div>
        </div>

        <div className="flex flex-col items-center">
          <img src={'/caths-nav.png'} className='h-10 cursor-pointer hover:animate-spin' alt="" onClick={()=> setTheme('caths')} />
          <div className="text-sm">Caths</div>
        </div>
      </div>

    </div>
  )
}

export default Navbar