'use client'
import React from 'react';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
const page = () => {
    const{status}=useSession()
    const router=useRouter()
    useEffect(() => {
        if(status=='unauthenticated'){
            router.push('/login')
        }
    
    }, [status])
    
  return (
    <div className="relative min-h-screen bg-[#7A8AFF]">
      {/* Background image with transparency */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50 bg-[url('/paper.jpg')]"
      ></div>

      {/* Left and right sections */}
      <div className="relative z-10 flex min-h-screen">
        {/* Left section - Image */}
        <div className="w-1/2 flex items-center justify-center p-10">
          <img
            src='left.jpg'
            alt="Left Section Image"
            className="max-w-[80%] h-auto  shadow-lg border-2 border-indigo-200 p-4"
          />
        </div>

        {/* Right section - About Us content */}
        <div className="w-1/2 flex items-center justify-center p-10">
          <div className="text-black max-w-2xl">
            <h1 className="text-4xl font-bold mb-6">About Us</h1>
            <p className="text-lg mb-6">
              Welcome to <span className="font-bold">Noteflow</span>!
            </p>
            <p className="text-lg mb-6">  
             We're just a bunch of college students who got tired of forgetting deadlines and misplacing notes—so we did what any logical person would do: built something to hopefully fix our mess.
            </p>
            <p className="text-lg mb-6">
              Our goal? To create a simple, no-nonsense tool that actually helps people stay organized (including us). But wait, there's more! In a moment of pure genius (or madness), we even added Gemini—because why struggle alone when you can have an AI helping you... or at least pretending to?
            </p>
            <p className="text-lg mb-6">
              Now, whether you need task reminders, productivity tips, or just someone to talk to when procrastination hits, Gemini's got your back (probably). We're always working on making this app better or breaking things in the process, so stay tuned!
            </p>
            <p className="text-lg mb-6">
              Got feedback? Hit us up—we might even listen. Thanks for joining us on this wild ride!
            </p>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;