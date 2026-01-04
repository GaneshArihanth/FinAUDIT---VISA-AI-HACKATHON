import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Dashboard = ({ data, onReset }) => {
    const { scores, metadata, analysis } = data;

    // Transform dimension scores for chart
    const dimData = Object.keys(scores.dimension_scores).map(key => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        score: scores.dimension_scores[key]
    }));

    const healthData = [
        { name: 'Health', value: scores.health_score },
        { name: 'Gap', value: 100 - scores.health_score }
    ];

    return (
        <div className="animate-fade-in">
            {/* Header Section */}
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1>Analysis Report</h1>
                    <p>File: <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{data.filename}</span></p>
                </div>
                <button onClick={onReset} className="btn" style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                    ← Upload New File
                </button>
            </div>

            {/* Top Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>

                {/* Overall Score Card */}
                <div className="card flex-center" style={{ flexDirection: 'column' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Overall Health Score</h3>
                    <div style={{ width: '100%', height: 200 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={healthData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                    startAngle={90}
                                    endAngle={450}
                                >
                                    <Cell fill={scores.health_score > 70 ? 'var(--color-success)' : 'var(--color-warning)'} />
                                    <Cell fill="var(--color-bg-body)" />
                                </Pie>
                                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                                    <tspan x="50%" dy="-0.5em" fontSize="2rem" fontWeight="bold" fill="var(--color-text-main)">
                                        {scores.health_score}
                                    </tspan>
                                    <tspan x="50%" dy="1.5em" fontSize="0.875rem" fill="var(--color-text-muted)">
                                        / 100
                                    </tspan>
                                </text>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <p style={{ fontSize: '0.875rem' }}>Compliance Score: <strong>{scores.overall_score}</strong></p>
                </div>

                {/* Dimension Breakdown */}
                <div className="card">
                    <h3 style={{ marginBottom: '1rem' }}>Dimension Breakdown</h3>
                    <div style={{ width: '100%', height: 200 }}>
                        <ResponsiveContainer>
                            <BarChart data={dimData} layout="vertical" margin={{ left: 40 }}>
                                <XAxis type="number" domain={[0, 100]} hide />
                                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                                    {dimData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.score > 80 ? 'var(--color-success)' : entry.score > 50 ? 'var(--color-warning)' : 'var(--color-danger)'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* AI Analysis Section */}
            <div className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--color-primary)' }}>
                <div className="flex-between" style={{ marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0 }}>AI Advisory Analysis</h3>
                    <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'var(--color-primary-subtle)', color: 'var(--color-primary)', borderRadius: '4px' }}>
                        Powered by Gemini
                    </span>
                </div>

                {analysis.executive_summary ? (
                    <>
                        <p style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--color-text-main)', marginBottom: '1.5rem' }}>
                            {analysis.executive_summary}
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div>
                                <h4 style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textTransform: 'uppercase' }}>Risk Assessment</h4>
                                <p>{analysis.risk_assessment}</p>
                            </div>

                            <div>
                                <h4 style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textTransform: 'uppercase' }}>Recommended Remediation</h4>
                                <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem' }}>
                                    {analysis.remediation_steps.map((step, idx) => (
                                        <li key={idx} style={{ marginBottom: '0.5rem' }}>
                                            <strong>{step.issue}</strong>: {step.action}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </>
                ) : (
                    <p>AI Analysis not available.</p>
                )}
            </div>

            {/* Detailed Rule Breakdown */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Detailed Rule Breakdown</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Dimension / Rule</th>
                                <th style={{ textAlign: 'center', padding: '0.75rem' }}>Status</th>
                                <th style={{ textAlign: 'right', padding: '0.75rem' }}>Score</th>
                                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(scores.rule_results).map(([key, result]) => (
                                <tr key={key} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td style={{ padding: '0.75rem', fontWeight: 500 }}>
                                        {key.replace(/_/g, ' ')}
                                    </td>
                                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '4px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            background: result.passed ? 'var(--color-success-subtle)' : 'var(--color-danger-subtle)',
                                            color: result.passed ? 'var(--color-success)' : 'var(--color-danger)'
                                        }}>
                                            {result.passed ? 'PASS' : 'FAIL'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                                        {result.score ? Math.round(result.score) : 0}%
                                    </td>
                                    <td style={{ padding: '0.75rem', color: 'var(--color-text-muted)' }}>
                                        {result.details}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Metadata / Details */}
            <div className="card">
                <h3 style={{ marginBottom: '1rem' }}>Dataset Metadata</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div style={{ background: 'var(--color-bg-body)', padding: '1rem', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Total Rows</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{metadata.total_rows}</div>
                    </div>
                    <div style={{ background: 'var(--color-bg-body)', padding: '1rem', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Columns</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{metadata.total_columns}</div>
                    </div>
                    {/* Render column details list if space permits */}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
