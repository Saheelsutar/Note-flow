"use client"
import "./typingeffect.scss";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter()
  return (
   <>
    
    <div className="bg-mycolor h-screen">
 <div className="flex justify-center items-center p-4">
  <div className="">
  <div className="self-center text-4xl font-semibold whitespace-nowrap dark:text-white typingeffect text-white tracking-wide bg-mycolor p-3"></div>

  
 <div className="py-6 text-2xl text-slate-900 font-semibold">

 </div>
<div className="text-xl font-semibold">
<h3 className="p-2">📝 Instant Notes – Quickly capture, organize, and access your ideas without hassle.</h3>
<h3 className="p-2">✅ To-Do & Deadlines – Keep track of tasks, set priorities, and never miss a deadline.
</h3>
<h3 className="p-2">🤖 AI Summaries with Gemini – Get concise, AI-generated insights to review notes faster.
 Instant Notes – Quickly capture, organize, and access your ideas without hassle.</h3>
</div>
</div>

  <div className="min-w-fit">
    <img src="task_vector.png" className="w-[800px] h-[500px]" alt="" />
  </div>
 </div>
 <div className="flex justify-center items-center">
 <button onClick={()=>router.push('/login')}
  type="button" className="border-2 text-white bg-[#2557D6] hover:bg-[#2557D6]/90 focus:ring-4 focus:ring-[#2557D6]/50 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#2557D6]/50 ">
<img className="h-6" src="logo.png"  alt="" />
Get Started
</button>
 </div>

 </div>
   </>
  );
}
