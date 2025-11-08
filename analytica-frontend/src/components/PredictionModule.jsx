import React, { useState } from 'react';
import axios from 'axios';

// --- Icon Components ---
const IconTarget = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.5 2.5m2.5-2.5l-2.828 2.828M3 10.5v5.25m0 0l3-3m-3 3l3 3m0 0l3.75-3.75M21 10.5v5.25m0 0l-3-3m3 3l-3 3m0 0l-3.75-3.75M3 13.5h18" />
  </svg>
);
const IconBrain = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
  </svg>
);

// --- Main Prediction Module ---
const PredictionModule = ({ analysisData, fileName }) => {
  const [targetColumn, setTargetColumn] = useState('');
  const [predictionResults, setPredictionResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Set the default target column to the last column
  useState(() => {
    if (analysisData?.column_details?.length > 0) {
      setTargetColumn(analysisData.column_details[analysisData.column_details.length - 1].column_name);
    }
  }, [analysisData]);

  const handleRunPrediction = async () => {
    if (!targetColumn) {
      setError('Please select a target column.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setPredictionResults(null);
    
    try {
      // Call our NEW Node.js /api/predict endpoint
      const res = await axios.post('http://localhost:5001/api/predict', {
        fileName: fileName,
        targetColumn: targetColumn,
      });
      
      setPredictionResults(res.data);
      
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Prediction failed. Please check the logs.';
      setError(errorMsg);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper to format metric names
  const formatMetricName = (name) => {
    return name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };
  
  // Helper to format metric values
  const formatMetricValue = (value) => {
    return (value * 100).toFixed(2) + '%';
  };

  return (
    <div className="mt-12 animate-fade-in">
      <h2 className="text-2xl font-bold text-white mb-6">Predictive Modeling</h2>
      
      <div className="bg-slate-800/60 backdrop-blur-lg border border-slate-700/50 rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* --- Target Column Selector --- */}
          <div className="md:col-span-2">
            <label htmlFor="targetColumn" className="block text-sm font-medium text-gray-300 mb-2">
              <IconTarget className="w-5 h-5 inline-block mr-2" />
              Select Target Column (What to predict)
            </label>
            <select
              id="targetColumn"
              name="targetColumn"
              value={targetColumn}
              onChange={(e) => setTargetColumn(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {analysisData.column_details.map((col) => (
                <option key={col.column_name} value={col.column_name}>
                  {col.column_name} (Type: {col.data_type})
                </option>
              ))}
            </select>
          </div>
          
          {/* --- Run Button --- */}
          <div>
            <button
              onClick={handleRunPrediction}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IconBrain className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Training Models...' : 'Run Models'}
            </button>
          </div>
        </div>
        
        {/* --- Error Message --- */}
        {error && (
          <div className="mt-4 bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>
      
      {/* --- Prediction Results Table --- */}
      {predictionResults && (
        <div className="mt-10 animate-fade-in">
          <h3 className="text-xl font-semibold text-white mb-4">
            Model Results ({predictionResults.problem_type})
          </h3>
          <div className="bg-slate-800/60 backdrop-blur-lg border border-slate-700/50 rounded-lg shadow-lg overflow-hidden">
            <table className="min-w-full divide-y divide-slate-700/50">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Model</th>
                  {/* Dynamically create headers from the metrics */}
                  {predictionResults.model_results[0] && Object.keys(predictionResults.model_results[0].metrics).map(metric => (
                     <th key={metric} className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{formatMetricName(metric)}</th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {predictionResults.model_results.map((result) => (
                  <tr key={result.model_name} className="hover:bg-slate-800/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{result.model_name}</td>
                    {/* Dynamically show values */}
                    {Object.entries(result.metrics).map(([name, value]) => (
                      <td key={name} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {/* We format percentages, but not R2 or MSE/RMSE */}
                        {name.includes('score') && !name.includes('r2') ? formatMetricValue(value) : value.toFixed(4)}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {result.status === 'Success' ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900/50 text-green-300">Success</span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-900/50 text-red-300">Failed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default PredictionModule;