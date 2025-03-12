import path from 'path';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const BASE_DIR = path.join(process.cwd(), 'public', 'uploads');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });

let lastSummary = ''; // Store the last generated summary

const getdata = async (filePath) => {
    try {
        const uploadResult = await fileManager.uploadFile(filePath, {
            mimeType: "application/pdf",
            displayName: "Flight Plan",
        });

        const result = await model.generateContent([
            {
                fileData: {
                    fileUri: uploadResult.file.uri,
                    mimeType: uploadResult.file.mimeType,
                },
            },
            'Summarize this document',
        ]);

        const summary = result.response.text();
        lastSummary = summary; // Store summary in memory
        return summary;
    } catch (error) {
        console.error("Error generating summary:", error);
        return "Error generating summary.";
    }
};

// Handle POST Request from `/dashboard`
export async function POST(req) {
    try {
        const { fileName, currentFolder } = await req.json();

        if (!fileName) {
            return NextResponse.json({ error: 'File does not exist' }, { status: 400 });
        }

        const filePath = path.join(BASE_DIR, currentFolder, fileName);
        const summary = await getdata(filePath); // Wait for summary

        return NextResponse.json({ message: 'Summary created' });
    } catch (error) {
        return NextResponse.json({ error: 'Error summarizing file' }, { status: 500 });
    }
}

// Handle GET Request from `/getsummary`
export async function GET() {
    return NextResponse.json({ summary: lastSummary || "No summary available." });
}
