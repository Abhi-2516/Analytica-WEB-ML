import React from 'react';

// --- Icon Components ---
const IconRows = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const IconColumns = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zm0 5.25h.75v.75h-.75v-.75zm0 5.25h.75v.75h-.75v-.75zm5.25-10.5h.75v.75h-.75v-.75zm0 5.25h.75v.75h-.75v-.75zm0 5.25h.75v.75h-.75v-.75zm5.25-10.5h.75v.75h-.75v-.75zm0 5.25h.75v.75h-.75v-.75zm0 5.25h.75v.75h-.75v-.75zM3 3h18M3 21h18M3 6.75v10.5M21 6.75v10.5" />
  </svg>
);

const IconMissing = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
  </svg>
);

// --- Stat Card Component ---
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-slate-800/60 backdrop-blur-lg border border-slate-700/50 rounded-lg p-5">
    <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${color}`}>
      {icon}
    </div>
    <div className="mt-4">
      <p className="text-sm font-medium text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

// --- Main Analysis Report Component ---
const AnalysisReport = ({ data }) => {
  if (!data) return null;

  const { file_info, column_details } = data;

  return (
    <div className="mt-12 animate-fade-in">
      <h2 className="text-2xl font-bold text-white mb-6">Analysis Report</h2>

      {/* --- Stat Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Rows"
          value={file_info.total_rows.toLocaleString()}
          icon={<IconRows />}
          color="bg-blue-600/30 text-blue-300"
        />
        <StatCard
          title="Total Columns"
          value={file_info.total_columns.toLocaleString()}
          icon={<IconColumns />}
          color="bg-green-600/30 text-green-300"
        />
        <StatCard
          title="Total Missing Values"
          value={file_info.total_missing_values.toLocaleString()}
          icon={<IconMissing />}
          color="bg-yellow-600/30 text-yellow-300"
        />
      </div>

      {/* --- Column Details Table --- */}
      <div className="mt-10 bg-slate-800/60 backdrop-blur-lg border border-slate-700/50 rounded-lg shadow-lg overflow-hidden">
        <h3 className="text-lg font-semibold text-white p-5 border-b border-slate-700/50">
          Column Details
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700/50">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Column Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Data Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Missing Values</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Unique Values</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {column_details.map((col) => (
                <tr key={col.column_name} className="hover:bg-slate-800/80 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{col.column_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{col.data_type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{col.missing_values.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{col.unique_values.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalysisReport;