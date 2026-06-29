'use client'
import { AppContext } from '@/context/AppContext';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { BsPauseCircleFill } from "react-icons/bs";

const page = () => {
  const { theme} = useContext(AppContext)
  const [seconds, setSeconds] = useState(8);
  const [numberOne, setNumberOne] = useState<null | number>(null)
  const [numberTwo, setNumberTwo] = useState<null | number>(null)
  const [answer, setAnswer] = useState<null | number>(null)
  const [start, setStart] = useState(false)
  const [timerStarted, setTimerStarted] = useState(false)
  const [spokenAnswer, setSpokenAnswer] = useState<string | null>("");
  const [result, setResult] = useState<null | string>(null)
  const speechRef = useRef<any>(null);

  const startRef = useRef(start);

  useEffect(() => {
    startRef.current = start;

    if (start) {
      nextQuestion();
    }else {
      setSeconds(0)
    }
  }, [start]);

  window.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    event.preventDefault(); 
    
    setSeconds(0)
  }
});


  const number_to_word: Record<number, string> = {
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five',
    6: 'six',
    7: 'seven',
    8: 'eight',
    9: 'nine',
    10: 'ten',
    11: 'eleven',
    12: 'twelve',
  }

  const word_to_number: Record<string, number> = {
    'one': 1,
    'two': 2,
    'three': 3,
    'four': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9,
    'ten': 10,
    'eleven': 11,
    'twelve': 12,
    'thirteen': 13,
    'fourteen': 14,
    'fifteen': 15,
    'sixteen': 16,
    'seventeen': 17,
    'eighteen': 18,
    'nineteen': 19,
    'twenty': 20,
    'thirty': 30,
    'fourty': 40,
    'fifty': 50,
    'sixty': 60,
    'seventy': 70,
    'eighty': 80,
    'ninety': 90,
    'one hundred': 100,
    'one hundred and': 100,
  }


  useEffect(() => {
    if (!timerStarted || seconds <= 0) return;

    const intervalId = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);

  })

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSpokenAnswer(transcript);
    };

    speechRef.current = recognition;
  }, []);

  useEffect(() => {
    if (!timerStarted) return;


    speechRef.current?.start();

    const intervalId = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
      speechRef.current?.stop();
    };
  }, [timerStarted]);

  useEffect(() => {
    if (seconds != 0) return

    let total = 0;

    if (typeof spokenAnswer === "number") return spokenAnswer;

    const cleaned = spokenAnswer?.trim().toLowerCase() || '0'

    // 1️⃣ If it's digits like "87"
    if (/^\d+$/.test(cleaned)) {
      total = Number(cleaned);
    }

    // 2️⃣ If it's word-based like "eighty seven"
    const words = cleaned
      .replace(/-/g, " ")
      .split(" ")
      .filter(Boolean);



    for (const word of words) {
      if (word_to_number[word] !== undefined) {
        total += word_to_number[word];
      }
    }


    if (total === answer) {
      setResult('Correct!')
      const correct = new Audio(`/correct.mp3`);
      if (!startRef.current) return;
      playAudio(correct);



    } else {
      setResult(`Incorrect! The answer is ${answer}`)
      const incorrect = new Audio(`/incorrect.mp3`);
      if (!startRef.current) return;
      playAudio(incorrect);
    }



    setTimerStarted(false)
    setTimeout(() => { nextQuestion() }, 3000);


  }, [seconds])

  const nextQuestion = async () => {
    setResult(null)
    setSpokenAnswer(null)
    setTimerStarted(false);
    setSeconds(8);
    const number_one = Math.floor(Math.random() * (12 - 2 + 1)) + 2
    setNumberOne(number_one)
    const number_two = Math.floor(Math.random() * (12 - 2 + 1)) + 2
    setNumberTwo(number_two)
    const get_answer = number_one * number_two
    setAnswer(get_answer)

    const one = new Audio(`/${number_to_word[number_one]}-voice.m4a`);
    const times = new Audio("/times-voice.m4a");
    const two = new Audio(`/${number_to_word[number_two]}-voice.m4a`);


    if (!startRef.current) return;

    await playAudio(one);
    if (!startRef.current) return;
    await playAudio(times);
    if (!startRef.current) return;
    await playAudio(two);
    if (!startRef.current) return;

    setTimerStarted(true)



  }


  function playAudio(audio: any) {
    return new Promise((resolve) => {
      audio.onended = resolve;
      audio.play();
    });
  }


  const bgMap: Record<string, string> = {
    'chicky-choo': 'bg-[#E5D360]/26',
    'beary-cute': 'bg-[#AB6D30]/26',
    'mochi': 'bg-[#AFCC5E]/26',
    'caths': 'bg-[#F5DFD2]',
  };

  const charMap: Record<string, string> = {
    'chicky-choo': './chicky-choo.png',
    'beary-cute': './beary.png',
    'mochi': './mochi.png',
    'caths': './caths.png',
  };

  const charWidth: Record<string, string> = {
    'chicky-choo': '50',
    'beary-cute': '40',
    'mochi': '60',
    'caths': '70',
  };


  return (
    <div className='text-[#7F4E1C] flex flex-col justify-center items-center mt-10'>
      <div className="text-3xl">Practice</div>

      {/* --------- Practice section ----------- */}

      <div className='flex items-center justify-center gap-20 mt-10'>
        {/* ----------- Right side --------- */}
        <div className="flex flex-col items-center justify-between h-90">
          <div className="flex flex-col items-center">
            <div className="text-xl">TIMER</div>
            <div className="text-5xl">00:{seconds < 10 && '0'}{seconds}</div>
          </div>
          <img src={`${charMap[theme]}`} className={`w-${charWidth[theme]}`} alt="" />
        </div>

        {/* ----------- Left Side ------------ */}
        <div className={`flex flex-col border-2 ${bgMap[theme]} relative p-10 w-120 h-100 rounded-4xl text-center items-center justify-between`}>
          {

            start === false
              ? <div onClick={() => setStart(true)} className="text-4xl bg-[#7F4E1C] cursor-pointer rounded-full text-white px-5 py-2 ">START</div>
              :
              <>
                <div onClick={() => setStart(false)} className=" rounded-full w-8 h-8 absolute right-5 top-5 text-[#7F4E1C] text-3xl hover:scale-115 transition-all duration-200 cursor-pointer"><BsPauseCircleFill /></div>
                <div className="">What is...</div>
                <div className="text-6xl">{numberOne} x {numberTwo}</div>
                <div className=" bg-[#7F4E1C] text-2xl h-10 flex items-center justify-center text-white rounded-full w-85">{spokenAnswer}</div>
                <div className={`text-lg  px-5 ${result === 'Correct!' ? 'text-green-700 bg-green-200': 'text-red-700 bg-red-200'} rounded-lg ${!result && 'hidden'}`}>{result}</div>
              </>

          }
        </div>
          

      </div>
      <div className='text-xl mt-5'> press spacebar to check your answer before timer ends </div>
    </div>
  )
}

export default page