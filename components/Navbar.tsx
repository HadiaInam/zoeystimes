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
    className="md:h-26 h-20 cursor-pointer"
    alt={`${theme} logo`}
    onClick={() => redirect('/')}
  />
</div>

      {/* ----------- THEMES ---------- */}
      <div className={`flex sm:gap-5 gap-2 items-center mr-3 `}>

        <div className="flex flex-col items-center">
          <img src={'/chicky-nav.png'} className='md:h-10 h-8 cursor-pointer hover:animate-spin' alt="" onClick={()=> setTheme('chicky-choo')} />
          <div className="sm:text-sm sm:block hidden">Chicky-choo</div>
        </div>

         <div className="flex flex-col items-center">
          <img src={'/beary-nav.png'} className='md:h-10 h-8  cursor-pointer hover:animate-spin' alt="" onClick={()=> setTheme('beary-cute')} />
          <div className="sm:text-sm sm:block hidden">Beary-cute</div>
        </div>

        <div className="flex flex-col items-center">
          <img src={'/mochi-nav.png'} className='md:h-10 h-8  cursor-pointer hover:animate-spin' alt="" onClick={()=> setTheme('mochi')} />
          <div className="sm:text-sm sm:block hidden">Mochi</div>
        </div>

        <div className="flex flex-col items-center">
          <img src={'/caths-nav.png'} className='md:h-10 h-8  cursor-pointer hover:animate-spin' alt="" onClick={()=> setTheme('caths')} />
          <div className="sm:text-sm sm:block hidden">Caths</div>
        </div>
      </div>

    </div>
  )
}

export default Navbar