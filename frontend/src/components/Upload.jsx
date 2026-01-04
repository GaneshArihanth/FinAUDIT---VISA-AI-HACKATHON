import React, { useState } from 'react';

const Upload = ({ onAnalysisComplete }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError(null);
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a file first.");
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8000/api/analyze', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }

            const data = await response.json();
            onAnalysisComplete(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card" style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '1rem' }}>Upload Transaction Data</h2>
            <p style={{ marginBottom: '2rem' }}>
                Securely analyze your dataset for compliance. <br />
                <span style={{ fontSize: '0.875rem', color: 'var(--color-primary)' }}>
                    *Metadata-only processing. No raw data stored.
                </span>
            </p>

            <div style={{
                border: '2px dashed var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '3rem',
                marginBottom: '2rem',
                background: 'var(--color-bg-body)'
            }}>
                <input
                    type="file"
                    accept=".csv,.json,.xlsx"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    id="file-upload"
                />
                <label htmlFor="file-upload" className="btn btn-primary">
                    Choose File
                </label>
                {file && <p style={{ marginTop: '1rem' }}>Selected: {file.name}</p>}
            </div>

            {error && (
                <div style={{
                    color: 'var(--color-danger)',
                    background: 'var(--color-danger-bg)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1rem'
                }}>
                    {error}
                </div>
            )}

            <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={handleUpload}
                disabled={loading || !file}
            >
                {loading ? 'Analyzing...' : 'Run Compliance Scan'}
            </button>
        </div>
    );
};

export default Upload;
