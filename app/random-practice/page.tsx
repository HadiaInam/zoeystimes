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
  const NUMBERS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const speechRef = useRef<any>(null);

  const startRef = useRef(start);
  const tableRef = useRef<number[] | null>(null);

    const [table, setTable] = useState<number[] | null>(null);
  
    const toggleTable = (num: number) => {
      setTable((prev) => {
        let next: number[] | null;

        if (prev === null) {
          next = [num];
        } else if (prev.includes(num)) {
          const filtered = prev.filter((n) => n !== num);
          next = filtered.length === 0 ? null : filtered;
        } else {
          next = [...prev, num];
        }

        tableRef.current = next;
        return next;
      });
    };

  useEffect(() => {
    tableRef.current = table;
  }, [table]);

  useEffect(() => {
    startRef.current = start;

    if (start) {
      nextQuestion();
    }else {
      setSeconds(0)
    }
  }, [start]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        setSeconds(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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


    if (/^\d+$/.test(cleaned)) {
      total = Number(cleaned);
    }

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

  const pickRandom = (nums: number[]) => nums[Math.floor(Math.random() * nums.length)];

  const nextQuestion = async () => {
    setResult(null)
    setSpokenAnswer(null)
    setTimerStarted(false);
    setSeconds(8);

    const selectedTables = tableRef.current;
    let number_one: number;
    let number_two: number;

    if (selectedTables === null) {
      number_one = pickRandom(NUMBERS);
      number_two = pickRandom(NUMBERS);
    } else {
      const fromSelected = pickRandom(selectedTables);
      const other = pickRandom(NUMBERS);
      if (Math.random() < 0.5) {
        number_one = fromSelected;
        number_two = other;
      } else {
        number_one = other;
        number_two = fromSelected;
      }
    }

    setNumberOne(number_one)
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
    'chicky-choo': 'w-50',
    'beary-cute': 'w-40',
    'mochi': 'w-60',
    'caths': 'w-70',
  };


  return (
    <div className='text-[#7F4E1C] flex flex-col justify-center items-center mt-8'>

      {/* --------- Select the tables buttons ----------- */}
      <div className="flex items-center justify-center gap-2 m-5 flex-wrap">
      <div
        onClick={() => {
          tableRef.current = null;
          setTable(null);
        }}
        className={`text-xl font-bold text-[#7F4E1C] rounded-full px-5 py-2 cursor-pointer border-2 border-[#7F4E1C] ${
          table === null ? "bg-[#7F4E1C] text-white" : ""
        }`}
      >
        All
      </div>

      {NUMBERS.map((num) => (
        <div
          key={num}
          onClick={() => toggleTable(num)}
          className={`text-xl font-bold text-[#7F4E1C] rounded-full px-5 py-2 cursor-pointer border-2 border-[#7F4E1C] ${
            table?.includes(num) ? "bg-[#7F4E1C] text-white" : ""
          }`}
        >
          {num}
        </div>
      ))}
    </div>

      {/* --------- Practice section ----------- */}

      <div className='flex items-center justify-center gap-20 mt-5'>
        {/* ----------- Right side --------- */}
        <div className="flex flex-col items-center justify-between h-90">
          <div className="flex flex-col items-center">
            <div className="text-xl">TIMER</div>
            <div className="text-5xl">00:{seconds < 10 && '0'}{seconds}</div>
          </div>
          <img src={`${charMap[theme]}`} className={charWidth[theme]} alt="" />
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