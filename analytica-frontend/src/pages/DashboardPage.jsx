import React, { useState, useEffect, useRef } from 'react';
import AnalysisReport from '../components/AnalysisReport.jsx';
import PredictionModule from '../components/PredictionModule.jsx'; // 1. IMPORT new module
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// --- Icons (Inline SVGs) ---
const IconDashboard = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m1-3 1 3m0 0-1 3m1-3 1 3m0 0h-7.5m7.5 0h3.75M3 12h18M3 12h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v3.75A2.25 2.25 0 0 1 18 18h-2.25a2.25 2.25 0 0 1-2.25-2.25V15m-7.5 0v3.75A2.25 2.25 0 0 0 6 18h2.25a2.25 2.25 0 0 0 2.25-2.25V15m0 0h7.5"
    />
  </svg>
);

const IconUpload = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-10 h-10 text-gray-400"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.61 0 4.5 4.5 0 0 1 3.11 5.197M4.5 21h15a2.25 2.25 0 0 0 2.25-2.25v-1.5a2.25 2.25 0 0 0-2.25-2.25h-15a2.25 2.25 0 0 0-2.25 2.25v1.5A2.25 2.25 0 0 0 4.5 21Z"
    />
  </svg>
);

const IconFile = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5 6H5.625a1.875 1.875 0 0 1-1.875-1.875v-11.25a1.875 1.875 0 0 1 1.875-1.875H9v6.75a.75.75 0 0 0 .75.75h6a.75.75 0 0 0 .75-.75V3.375c.621 0 1.125.504 1.125 1.125v11.25a1.875 1.875 0 0 1-1.875 1.875h-2.25"
    />
  </svg>
);

const IconLogout = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3H6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 6 21h7.5a2.25 2.25 0 0 0 2.25-2.25V15m-3-3-3 3m0 0 3 3m-3-3h12.75"
    />
  </svg>
);

// --- Main Dashboard Component ---

const DashboardPage = () => {
  const navigate = useNavigate();

  // --- State ---
  const [file, setFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [fileList, setFileList] = useState([]);
  const fileInputRef = useRef(null);
  
  const [analysisResult, setAnalysisResult] = useState(null);
  const [currentFile, setCurrentFile] = useState(null); // 2. ADD state for current file

  // --- Auth Check ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
    // In a real app, you'd fetch user data here
    // and also fetch the user's existing files from the DB
  }, [navigate]);

  // --- Handlers ---

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleFileSelect = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
      setMessage({ type: 'info', text: `Selected file: ${selectedFile.name}` });
      // 5. Clear old analysis when new file is selected
      setAnalysisResult(null);
      setCurrentFile(null); // 3. CLEAR current file
    }
  };

  const handleDragEnter = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragOver(false); };
  const handleDragOver = (e) => { e.preventDefault(); };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file first!' });
      return;
    }

    setMessage({ type: 'info', text: 'Uploading and analyzing...' });
    setAnalysisResult(null); // Clear previous results
    setCurrentFile(null); // 4. CLEAR current file

    const formData = new FormData();
    formData.append('dataFile', file);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5001/api/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            // 'Authorization': `Bearer ${token}` // TODO: Add auth middleware
          },
        }
      );

      // Success!
      setMessage({ type: 'success', text: res.data.msg });
      
      // 4. Set the analysis result from the response
      setAnalysisResult(res.data.analysis);
      setCurrentFile({ name: res.data.fileName, path: res.data.filePath }); // 5. SET current file
      
      // Add to file list
      setFileList((prev) => [
        { name: res.data.fileName, size: `${(file.size / 1024 / 1024).toFixed(2)} MB` },
        ...prev,
      ]);
      setFile(null);

    } catch (err) {
      // Handle error from backend (which includes Python errors)
      if (err.response && err.response.data) {
        setMessage({ type: 'error', text: err.response.data.detail || err.response.data.msg });
      } else {
        setMessage({ type: 'error', text: 'Upload failed. Please try again.' });
      }
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen min-h-screen text-gray-200">
      {/* --- Animated Background --- */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 bg-[size:200%_200%] animate-gradient-shift" />

      {/* --- Sidebar --- */}
      <aside className="w-64 flex-shrink-0 flex-col bg-slate-900/60 backdrop-blur-lg border-r border-slate-700/50 hidden sm:flex">
        <div className="flex items-center justify-center h-20 border-b border-slate-700/50">
          <span className="text-white text-2xl font-bold">Analytica</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-indigo-600/50 text-white font-medium"
          >
            <IconDashboard />
            Dashboard
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-slate-800/50 hover:text-white transition-colors"
          >
            <IconFile />
            My Analyses
          </a>
        </nav>
        <div className="p-4 border-t border-slate-700/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-red-600/50 hover:text-white transition-colors"
          >
            <IconLogout />
            Logout
          </button>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 overflow-auto p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Welcome to Your Dashboard
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* --- Column 1: File Upload --- */}
            <div className="lg:col-span-2">
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center w-full p-8 md:p-12 border-2 border-dashed rounded-lg cursor-pointer
                  ${
                    isDragOver
                      ? 'border-indigo-400 bg-indigo-900/30'
                      : 'border-slate-700/50 bg-slate-800/50'
                  }
                  backdrop-blur-lg shadow-lg transition-all duration-300`}
                onClick={() => fileInputRef.current.click()}
              >
                <IconUpload />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                  className="hidden"
                  accept=".csv,.xlsx,.json"
                />
                <p className="mt-4 text-lg font-semibold text-white">
                  {isDragOver
                    ? 'Drop your file here'
                    : 'Drag & drop file or click to upload'}
                </p>
                <p className="mt-2 text-sm text-gray-400">
                  Supported formats: .csv, .xlsx, .json
                </p>

                {/* --- Message Area --- */}
                {message.text && (
                  <div className="mt-6 w-full text-center">
                    <p
                      className={`font-medium
                      ${message.type === 'success' ? 'text-green-400' : ''}
                      ${message.type === 'error' ? 'text-red-400' : ''}
                      ${message.type === 'info' ? 'text-blue-400' : ''}
                    `}
                    >
                      {message.text}
                    </p>
                  </div>
                )}

                {file && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click
                      handleUpload();
                    }}
                    className="mt-6 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-500 transition-all duration-300 transform hover:scale-105"
                  >
                    Upload & Analyze
                  </button>
                )}
              </div>
            </div>

            {/* --- Column 2: Recent Files --- */}
            <div className="row-start-1 lg:row-start-auto">
              <div className="h-full bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-5">
                  Recent Files
                </h2>
                <ul className="space-y-4">
                  {fileList.length === 0 && (
                    <p className="text-sm text-gray-400">No files uploaded yet.</p>
                  )}
                  {fileList.map((file, index) => (
                    <li
                      key={index}
                      className="flex items-center p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700/80 transition-colors cursor-pointer"
                    >
                      <div className="p-2 bg-indigo-600/50 rounded-lg">
                        <IconFile />
                      </div>
                      <div className="ml-4 flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-400">{file.size}</p>
                      </div>
                      <span className="text-xs text-indigo-400 hover:underline">
                        Analyze
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 6. Render the Analysis Report component */}
          <AnalysisReport data={analysisResult} />
          
          {/* 7. RENDER PREDICTION MODULE (if analysis is done) */}
          {analysisResult && currentFile && (
            <PredictionModule
              analysisData={analysisResult}
              fileName={currentFile.name}
            />
          )}

        </div>
      </main>
    </div>
  );
};

export default DashboardPage;