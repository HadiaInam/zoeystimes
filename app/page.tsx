'use client'
import React, { useContext, useEffect, useRef } from 'react'
import { AppContext } from "@/context/AppContext";
import { useRouter } from 'next/navigation';


const page = () => {
  const { theme, setTheme } = useContext(AppContext)
  const router = useRouter()

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      audio.volume = 0.4;
      audio.loop = true;

      // Browsers require user interaction before playing audio.
      audio.play().catch(() => {});
    }

    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  const bgMap: Record<string, string> = {
    'chicky-choo': 'bg-[#E5D360]/26',
    'beary-cute': 'bg-[#AB6D30]/26',
    'mochi': 'bg-[#AFCC5E]/26',
    'caths': 'bg-[#F5DFD2]',
  };

  return (
    <div className="flex flex-col sm:flex-row text-[#7F4E1C] mt-20 text-center justify-center items-center lg:gap-20 md:gap-10 gap-5">

      <audio ref={audioRef}>
        <source src="/bg-music.mp3" type="audio/mpeg" />
      </audio>


      {/* ------------ TITLE ----------- */}
      <div className="flex flex-col md:text-left text-center w-auto md:text-lg text-base">
      <div className="md:text-4xl text-3xl font-bold">Hello, little <span className='text-yellow-500'>mathematician!!</span></div>
      <div className='md:w-auto w-90'>Choose your mode to get started</div>
      <div className="mt-10 text-lg md:w-auto w-90">Keep practicing to become an expert in multiplication and maybe more :&#41;</div>
      <div className="text-lg md:w-auto w-90">Click the button to get started with random practice</div>
      </div>

      {/* ------------ MODES ---------------- */}
      <div className="flex items-center justify-center gap-10 mt-10 md:mb-0 mb-15">
        <div onClick={() => router.push('/random-practice')} className={`border-2 cursor-pointer border-[#7F4E1C] rounded-3xl h-80 w-60 flex flex-col items-center justify-center gap-9 ${bgMap[theme]}`}>
          <div className="text-2xl">Random Practice</div>
          <img src={'./random-practice.png'} className='h-40 animate-bounce' alt="" />
        </div>
      </div>
    </div>
  )
}

export default page