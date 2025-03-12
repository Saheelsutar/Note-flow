"use client"
import React from 'react'
import { useState,useEffect } from 'react';
const page = () => {
const [summary, setSummary] = useState('');

    useEffect(() => {
        const fetchSummary = async () => {
            const response = await fetch('/api/summary'); // GET request
            const data = await response.json();
            setSummary(data.summary);
        };

        fetchSummary();
    }, []); // Fetch summary on component load

    return (
        <div className="p-4 bg-mycolor text-white h-screen ">
            {summary.length > 0 && ( 
                <div className="flex items-center mb-2">
                    <h2 className="font-bold text-black text-xl">
                        Document Summary Powered By Gemini
                    </h2>
                </div>
            )}
            <p className="text-white">{summary || "Waiting for summary..."}</p>
        </div>
    );
};
export default page
