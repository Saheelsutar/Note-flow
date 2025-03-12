
const {GoogleAIFileManager}=require('@google/generative-ai/server')
const {GoogleGenerativeAI}=require('@google/generative-ai')
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KE);

const model =  genAI.getGenerativeModel ({ model: 'models/gemini-1.5-flash' });
 
const getdata=async() => {
  const uploadResult = await fileManager.uploadFile(
  'actions/Saheel_Resume.pdf',
  {
    mimeType: "application/pdf",
    displayName: "Flight Plan",
  },
);

const result = await model.generateContent([
    {
        fileData: {
            fileUri: uploadResult.file.uri,
            mimeType: uploadResult.file.mimeType,
        },
    },
    'Summarize this document',
]);
console.log(result.response.text());
}

getdata()
