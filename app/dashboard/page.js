"use client";
import React, { useState, useEffect,useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Todo from "@/components/Todo";

const Dashboard = () => {
    const { data: session,status } = useSession();
    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);
    const [currentFolder, setCurrentFolder] = useState("");
    const [newFolderName, setNewFolderName] = useState("");
    const [update, setupdate] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null);
    const router = useRouter()
    const ref=useRef(false)

    useEffect(() => {
        if (session?.user?.name) {
            initializeUserFolder(session.user.name);
           
          
        }
        if(status=='unauthenticated'){
            router.push('/login')
        }
    }, [session,status]);

    useEffect(() => {
        if (currentFolder !== null) {
            fetchFilesAndFolders();
        }
        
    }, [currentFolder,update]);
    
useEffect(() => {
    if(!ref.current && status=='authenticated'){
        alert("Successfully Logged In!!")
        ref.current=true
    }
    

}, [status])

    

    const initializeUserFolder = async (userName) => {
        try {
            const res = await fetch("/api/folders", {
                method: "POST",
                body: JSON.stringify({ folderName: userName, parentFolder: "" }),
                headers: { "Content-Type": "application/json" },
            });

            setCurrentFolder(userName);
            fetchFilesAndFolders();
        } catch (error) {
            console.error("Error initializing user folder:", error);
        }
    };

    const fetchFilesAndFolders = async () => {
        try {
            const res = await fetch(`/api/folders?folder=${currentFolder}`);
            if (!res.ok) throw new Error("Failed to fetch data");

            const data = await res.json();
            setFolders(data.files.filter(item => item.isFolder));
            setFiles(data.files.filter(item => !item.isFolder));
        } catch (error) {
            console.error("Error fetching folders:", error.message);
        }
    };

    const createFolder = async () => {
        if (!newFolderName) return alert("Folder name is required");

        const res = await fetch("/api/folders", {
            method: "POST",
            body: JSON.stringify({ folderName: newFolderName, parentFolder: currentFolder }),
            headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
            setNewFolderName("");
            fetchFilesAndFolders();
        } else {
            alert("Error creating folder");
        }
    };

    const uploadFile = async () => {
        if (!selectedFile) return alert("No file selected!");

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("parentFolder", currentFolder || "");

        const res = await fetch("/api/files", {
            method: "POST",
            body: formData,
        });

        if (res.ok) {
            setSelectedFile(null);
            fetchFilesAndFolders();
        } else {
            alert("Upload failed!");
        }
    };
    const deleteFile = async (fileName) => {
        const res = await fetch("/api/files", {
            method: "DELETE",
            body: JSON.stringify({ filePath: `${currentFolder}/${fileName}` }),
            headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
            fetchFilesAndFolders();
        } else {
            alert("Failed to delete file");
        }
    };

    const deleteFolder = async (folderName) => {
        if (!window.confirm(`Are you sure you want to delete "${folderName}"?`)) return;
        
        try {
            const res = await fetch(`/api/folders`,{
            method: "DELETE",
            body: JSON.stringify({currentFolder,folderName}),
            headers: { "Content-Type": "application/json" },
            
        });
        if (res.ok) {
            fetchFilesAndFolders();
        } else {
            alert("Failed to delete folder.");
        }
          
        } catch (error) {
            console.error("Error deleting folder:", error);
        }
    };
    const [loading, setLoading] = useState(false); // Track loading state

    const handleSummary = async (fileName) => {
        try {
            setLoading(true); // Show loading state

            const res = await fetch("/api/summary", {
                method: "POST",
                body: JSON.stringify({ fileName, currentFolder }),
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();
            console.log(data.message);

            if (res.ok) {
                // Redirect to /getsummary after summary is generated
                router.push("/getsummary");
            } else {
                console.error("Error generating summary:", data.error);
            }
        } catch (error) {
            console.error("Error initializing user folder:", error);
        } finally {
            setLoading(false); // Hide loading state
        }
    };
    

    return (
                <> 
                
                <div className="p-6 bg-[url('/main.jpg')] h-screen ">
       
                    {session &&
                    <div className="flex justify-evenly items-center h-40 gap-10 ">
                        <img className="h-48" src="note.png" alt="" />
                        <div className="flex flex-col justify-center items-center">
                    <div className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
Welcome {session.user.name}</div>
<img src="task.gif" alt="" /></div>
<img className="h-48" src="timer.png" alt="" />
</div>}
                <div className="flex justify-center items-center gap-6">
                    <div className="w-3/4 p-16 rounded-lg bg-amber-50 ">
                    <div>
                        <button onClick={() => {
                            setupdate(true)
                            setCurrentFolder(session.user.name)}}>🏠 Home</button>
                        {currentFolder && <span> / {currentFolder}</span>}
                    </div>

                    <div className="my-4">
                        <input type="text" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} placeholder="New Folder Name" className="border p-2" />
                        <button onClick={createFolder} className="bg-blue-500 text-white p-2 ml-2">Create Folder</button>
                    </div>

                    <div className="my-4">
                        <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
                        <button onClick={uploadFile} className="bg-green-500 text-white p-2 ml-2">Upload</button>
                    </div>

                    <h2 className="text-xl font-bold mt-4">Folders</h2>
                    <ul className="max-w-fit ">
                        {folders.length==0 && <div className="font-semibold">No Folders Yet</div>}
                        {folders.map((folder) => (
                            <li className=" flex items-center" key={folder.name}>
                                📁 
                                <button onClick={() => setCurrentFolder(`${currentFolder}/${folder.name}`)} className="text-blue-500 ">
                                    {folder.name}
                                </button>
                                <button onClick={() => deleteFolder(folder.name)} className="text-red-500 ml-2">
                                    <img className="w-5" src="delete.gif" alt="" />
                                </button>
                            </li>
                        ))}
                    </ul>

                    <h2 className="text-xl font-bold mt-4">Files</h2>
                    <ul className="max-w-fit">
                        {files.length==0 && <div className="font-semibold">No Files Yet</div>}
                        {files.map((file) => (
                            <li className="flex items-center" key={file.name}>
                                📄 
                                <a 
                                    href={`/uploads/${currentFolder ? `${currentFolder}/` : ""}${file.name}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-500 p-2"
                                >
                                    {file.name}
                                </a>
                                {file.name.endsWith('.pdf') && <button onClick={() => handleSummary(file.name)} type="button" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-[10px] px-4  py-2 text-center me-2 mb-2 w-fit"disabled={loading}>
                                {loading ? "Generating..." : "Summarize"}</button>}
                                <button onClick={() => deleteFile(file.name)} className="text-red-500 ml-2"><img className="w-5" src="delete.gif" alt="" /></button>
                            </li>
                        ))}
                    </ul>
                    </div>
                    <Todo/>
                    </div>
                    </div>
                </>
                
            );
        }

export default Dashboard;
