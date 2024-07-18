import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import DropDown, { VibeType } from '../components/DropDown';
import Footer from '../components/Footer';
import Header from '../components/Header';
import LoadingDots from '../components/LoadingDots';
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser';

import { Fa1, Fa2, Fa3 } from "react-icons/fa6";
const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [groupSize, setGroupSize] = useState('');
  const [topic, setTopic] = useState('');
  const [members, setMembers] = useState('');
  const [generatedGroups, setGeneratedGroups] = useState<String>('');

  const groupRef = useRef<null | HTMLDivElement>(null);

  const scrollToGroups = () => {
    if (groupRef.current !== null) {
      groupRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const prompt = `Generate groupings with ${groupSize} members per group based on the following topic: ${topic}. Include each member's name and their skills or job. Here are the members:
  ${members}. Only return the name of the member no need to include the skills`;

  console.log({ prompt });
  console.log({ generatedGroups });

  const generateGroups = async (e: any) => {
    e.preventDefault();
    setGeneratedGroups('');
    setLoading(true);
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = response.body;
    if (!data) {
      return;
    }

    const onParseGPT = (event: ParsedEvent | ReconnectInterval) => {
      if (event.type === 'event') {
        const data = event.data;
        try {
          const text = JSON.parse(data).text ?? '';
          setGeneratedGroups((prev) => prev + text);
        } catch (e) {
          console.error(e);
        }
      }
    };

    const onParse = onParseGPT;

    const reader = data.getReader();
    const decoder = new TextDecoder();
    const parser = createParser(onParse);
    let done = false;
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      parser.feed(chunkValue);
    }
    scrollToGroups();
    setLoading(false);
  };

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Groupings Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        {/* <p className="border rounded-2xl py-1 px-4 text-slate-500 text-sm mb-5 hover:scale-105 transition duration-300 ease-in-out">
          <b>96,434</b> groups generated so far
        </p> */}
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
          Generate your groupings using AI
        </h1>
        <div className="max-w-xl w-full">
          <div className="flex mt-10 items-center space-x-3">
            <Fa1 size={25} className="text-black" />
            <p className="text-left font-medium">
              Enter the number of members per group.
            </p>
          </div>
          <input
            type="number"
            value={groupSize}
            onChange={(e) => setGroupSize(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
            placeholder={'e.g. 4'}
          />
          <div className="flex  items-center space-x-3">
            <Fa2 size={25} className="text-black" />
            <p className="text-left font-medium">Enter the group topic.</p>
          </div>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
            placeholder={'e.g. Project Management'}
          />
          <div className="flex items-center space-x-3">
            <Fa3 size={25} className="text-black" />
            <p className="text-left font-medium">Enter the members and their skills/jobs.</p>
          </div>
          <textarea
            value={members}
            onChange={(e) => setMembers(e.target.value)}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
            placeholder={'e.g. Alice - Developer, Bob - Designer, Charlie - Manager'}
          />
          {!loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              onClick={(e) => generateGroups(e)}
            >
              Generate your groupings &rarr;
            </button>
          )}
          {loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            >
              <LoadingDots color="white" style="large" />
            </button>
          )}
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <div className="space-y-10 my-10">
          {generatedGroups && (
            <>
              <div>
                <h2
                  className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto"
                  ref={groupRef}
                >
                  Your generated groupings
                </h2>
              </div>
              <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                {generatedGroups
                  .split(/\d+\./) // Split on any number followed by a dot
                  .filter((group) => group.trim() !== '')
                  .map((generatedGroup, index) => {
                    return (
                      <div
                        className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedGroup);
                          toast('Group copied to clipboard', {
                            icon: '✂️',
                          });
                        }}
                        key={index}
                      >
                        <p>{generatedGroup}</p>
                      </div>
                    );
                  })}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
