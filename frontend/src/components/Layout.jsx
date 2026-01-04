import React from 'react';

const Layout = ({ children }) => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid var(--color-border)',
                position: 'sticky',
                top: 0,
                zIndex: 50
            }}>
                <div className="container flex-between" style={{ padding: '1rem 2rem' }}>
                    <div className="flex-center gap-md">
                        <div style={{
                            width: 32, height: 32,
                            background: 'var(--color-primary)',
                            borderRadius: 8
                        }} />
                        <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Data Health AI</h3>
                    </div>
                    <nav className="flex-center gap-md">
                        <a href="#" style={{ textDecoration: 'none', color: 'var(--color-text-main)', fontWeight: 500 }}>Dashboard</a>
                        <a href="#" style={{ textDecoration: 'none', color: 'var(--color-text-muted)', fontWeight: 500 }}>History</a>
                        <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>New Scan</button>
                    </nav>
                </div>
            </header>

            <main style={{ flex: 1 }}>
                {children}
            </main>

            <footer style={{
                borderTop: '1px solid var(--color-border)',
                background: 'white',
                padding: '2rem 0',
                marginTop: 'auto'
            }}>
                <div className="container" style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                    © 2026 Financial Data Health System. Metadata-only processing.
                </div>
            </footer>
        </div>
    );
};

export default Layout;
