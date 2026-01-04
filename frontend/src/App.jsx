import React, { useState } from 'react';
import Layout from './components/Layout';
import Upload from './components/Upload';
import Dashboard from './pages/Dashboard';

function App() {
  const [analysisData, setAnalysisData] = useState(null);

  return (
    <Layout>
      <div className="container">
        {!analysisData ? (
          <Upload onAnalysisComplete={setAnalysisData} />
        ) : (
          <Dashboard
            data={analysisData}
            onReset={() => setAnalysisData(null)}
          />
        )}
      </div>
    </Layout>
  );
}

export default App;
