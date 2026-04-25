import React, { useState } from "react";
import API from "../api";

const REPORTS = [
    {
        type: "patients",
        label: "Patient Report",
        description: "Full registry of all patients, demographics, and visit history.",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
        ),
        accent: "#2563eb",
        bg: "#eff6ff",
        border: "#bfdbfe",
        tag: "Clinical",
    },
    {
        type: "appointments",
        label: "Appointment Report",
        description: "Scheduled, completed, and cancelled appointments with doctor assignments.",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                <line x1="8" y1="14" x2="8" y2="14"/><line x1="12" y1="14" x2="12" y2="14"/><line x1="16" y1="14" x2="16" y2="14"/>
            </svg>
        ),
        accent: "#0d9488",
        bg: "#f0fdfa",
        border: "#99f6e4",
        tag: "Scheduling",
    },
    {
        type: "revenue",
        label: "Revenue Report",
        description: "Billing summaries, payment status, and revenue breakdown by period.",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
        ),
        accent: "#7c3aed",
        bg: "#f5f3ff",
        border: "#ddd6fe",
        tag: "Finance",
    },
];

function Reports() {
    const [loadingState, setLoadingState] = useState({});
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = "success") => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    };

    const downloadReport = async (reportType) => {
        setLoadingState(prev => ({ ...prev, [reportType]: true }));
        try {
            const response = await API.get(`reports/${reportType}/`, { responseType: "blob" });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${reportType}_report.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            addToast(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report downloaded.`, "success");
        } catch (error) {
            console.error("Error downloading report:", error);
            addToast("Failed to download report. Please try again.", "error");
        } finally {
            setLoadingState(prev => ({ ...prev, [reportType]: false }));
        }
    };

    return (
        <div style={s.page}>
            <style>{css}</style>

            {/* Toast notifications */}
            <div style={s.toastStack}>
                {toasts.map(t => (
                    <div key={t.id} style={{ ...s.toast, ...(t.type === "error" ? s.toastError : s.toastSuccess) }} className="toast-in">
                        <span style={s.toastDot(t.type)} />
                        {t.message}
                    </div>
                ))}
            </div>

            {/* Header */}
            <div style={s.header}>
                <div style={s.headerLeft}>
                    <p style={s.eyebrow}>Analytics</p>
                    <h1 style={s.title}>Reports</h1>
                    <p style={s.subtitle}>Download PDF reports for clinical, scheduling, and financial data.</p>
                </div>
                <div style={s.headerBadge}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                        <polyline points="10 9 9 9 8 9"/>
                    </svg>
                    <span style={s.headerBadgeText}>PDF format</span>
                </div>
            </div>

            {/* Divider */}
            <div style={s.divider} />

            {/* Report cards */}
            <div style={s.grid}>
                {REPORTS.map(report => {
                    const isLoading = loadingState[report.type];
                    return (
                        <div key={report.type} style={s.card} className="report-card">
                            <div style={s.cardTop}>
                                <div style={{ ...s.iconWrap, background: report.bg, border: `1.5px solid ${report.border}`, color: report.accent }}>
                                    {report.icon}
                                </div>
                                <span style={{ ...s.tag, background: report.bg, color: report.accent, border: `1px solid ${report.border}` }}>
                                    {report.tag}
                                </span>
                            </div>

                            <h2 style={s.cardTitle}>{report.label}</h2>
                            <p style={s.cardDesc}>{report.description}</p>

                            <div style={s.cardFooter}>
                                <div style={s.formatInfo}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                        <polyline points="14 2 14 8 20 8"/>
                                    </svg>
                                    <span style={s.formatText}>PDF</span>
                                </div>
                                <button
                                    onClick={() => downloadReport(report.type)}
                                    disabled={isLoading}
                                    style={{ ...s.dlBtn, ...(isLoading ? s.dlBtnDisabled : {}), "--accent": report.accent }}
                                    className="dl-btn"
                                >
                                    {isLoading ? (
                                        <>
                                            <span style={{ ...s.spinner, borderTopColor: report.accent }} />
                                            Generating…
                                        </>
                                    ) : (
                                        <>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                                <polyline points="7 10 12 15 17 10"/>
                                                <line x1="12" y1="15" x2="12" y2="3"/>
                                            </svg>
                                            Download
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer note */}
            <p style={s.footerNote}>
                Reports reflect the most current data at the time of generation.
            </p>
        </div>
    );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

  .report-card {
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .report-card:hover {
    box-shadow: 0 8px 32px rgba(0,0,0,0.09) !important;
    transform: translateY(-2px);
  }

  .dl-btn:hover:not(:disabled) {
    background: var(--accent) !important;
    color: #fff !important;
    border-color: var(--accent) !important;
  }
  .dl-btn:active:not(:disabled) {
    transform: scale(0.97);
  }

  @keyframes toast-in {
    from { opacity: 0; transform: translateX(20px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  .toast-in { animation: toast-in 0.25s ease; }

  @keyframes spin { to { transform: rotate(360deg); } }
`;

const s = {
    page: {
        padding: "36px 40px",
        fontFamily: "'DM Sans', sans-serif",
        background: "#f8fafc",
        minHeight: "100vh",
        color: "#111827",
        maxWidth: "900px",
    },

    // Toast
    toastStack: {
        position: "fixed", top: "24px", right: "24px",
        display: "flex", flexDirection: "column", gap: "8px",
        zIndex: 9999,
    },
    toast: {
        display: "flex", alignItems: "center", gap: "10px",
        padding: "12px 18px", borderRadius: "10px",
        fontSize: "13px", fontWeight: "500",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        minWidth: "260px",
    },
    toastSuccess: { background: "#fff", color: "#374151", border: "1.5px solid #e5e7eb" },
    toastError: { background: "#fef2f2", color: "#b91c1c", border: "1.5px solid #fecaca" },
    toastDot: (type) => ({
        width: "7px", height: "7px", borderRadius: "50%", flexShrink: 0,
        background: type === "error" ? "#ef4444" : "#22c55e",
    }),

    // Header
    header: {
        display: "flex", justifyContent: "space-between",
        alignItems: "flex-start", marginBottom: "20px",
        flexWrap: "wrap", gap: "12px",
    },
    headerLeft: {},
    eyebrow: {
        fontSize: "11px", fontWeight: "600",
        color: "#9ca3af", letterSpacing: "1px",
        textTransform: "uppercase", margin: "0 0 6px",
    },
    title: {
        fontSize: "28px", fontWeight: "600",
        color: "#0f172a", margin: "0 0 8px",
        letterSpacing: "-0.5px",
    },
    subtitle: { fontSize: "14px", color: "#6b7280", margin: 0 },
    headerBadge: {
        display: "flex", alignItems: "center", gap: "6px",
        background: "#fff", border: "1.5px solid #e5e7eb",
        borderRadius: "8px", padding: "8px 14px",
        alignSelf: "flex-start",
    },
    headerBadgeText: { fontSize: "13px", color: "#6b7280", fontWeight: "500" },

    divider: { height: "1px", background: "#e5e7eb", margin: "0 0 28px" },

    // Grid
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: "18px",
        marginBottom: "28px",
    },

    // Card
    card: {
        background: "#fff",
        border: "1.5px solid #e5e7eb",
        borderRadius: "14px",
        padding: "22px 22px 18px",
        display: "flex",
        flexDirection: "column",
        gap: "0",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    },
    cardTop: {
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: "16px",
    },
    iconWrap: {
        width: "44px", height: "44px", borderRadius: "10px",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
    },
    tag: {
        fontSize: "11px", fontWeight: "600",
        padding: "3px 9px", borderRadius: "6px",
        letterSpacing: "0.3px",
    },
    cardTitle: {
        fontSize: "16px", fontWeight: "600",
        color: "#111827", margin: "0 0 6px",
    },
    cardDesc: {
        fontSize: "13px", color: "#6b7280",
        margin: "0 0 20px", lineHeight: "1.55", flex: 1,
    },
    cardFooter: {
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginTop: "auto",
        paddingTop: "14px", borderTop: "1px solid #f3f4f6",
    },
    formatInfo: {
        display: "flex", alignItems: "center", gap: "5px",
    },
    formatText: { fontSize: "12px", color: "#9ca3af", fontWeight: "500" },

    dlBtn: {
        display: "inline-flex", alignItems: "center", gap: "6px",
        background: "transparent",
        border: "1.5px solid #e5e7eb",
        borderRadius: "8px",
        padding: "8px 16px",
        fontSize: "13px", fontWeight: "500",
        color: "#374151",
        cursor: "pointer",
        transition: "all 0.15s",
        fontFamily: "'DM Sans', sans-serif",
    },
    dlBtnDisabled: {
        opacity: 0.6, cursor: "not-allowed", pointerEvents: "none",
    },
    spinner: {
        width: "13px", height: "13px",
        border: "2px solid #e5e7eb",
        borderRadius: "50%",
        display: "inline-block",
        animation: "spin 0.7s linear infinite",
    },

    footerNote: {
        fontSize: "12px", color: "#9ca3af",
        textAlign: "center", margin: 0,
    },
};

export default Reports;