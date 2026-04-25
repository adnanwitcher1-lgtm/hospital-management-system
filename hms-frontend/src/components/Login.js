import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await API.post("login/", {
                username: username,
                password: password,
            });

            localStorage.setItem("access_token", response.data.access);
            localStorage.setItem("refresh_token", response.data.refresh);
            navigate("/dashboard");
        } catch (err) {
            setError("Invalid username or password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            {/* Left Panel */}
            <div style={styles.leftPanel}>
                <div style={styles.leftTop}>
                    <div style={styles.brandIcon}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                            stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>
                    </div>
                    <h1 style={styles.brandTitle}>MediCore{"\n"}Management System</h1>
                    <p style={styles.brandSub}>
                        Integrated hospital operations<br />and patient care platform
                    </p>
                </div>

                <div style={styles.statsList}>
                    {[
                        { color: "#1d9e75", label: "System Status", value: "All services operational" },
                        { color: "#378add", label: "Secure Access", value: "256-bit SSL encrypted" },
                        { color: "#ef9f27", label: "Support", value: "24/7 IT helpdesk available" },
                    ].map((s) => (
                        <div key={s.label} style={styles.statCard}>
                            <div style={{ ...styles.statDot, background: s.color }} />
                            <div>
                                <div style={styles.statLabel}>{s.label}</div>
                                <div style={styles.statValue}>{s.value}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel */}
            <div style={styles.rightPanel}>
                <div style={styles.formBox}>
                    <div style={styles.badge}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                            stroke="#1d9e75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
                        </svg>
                        Staff Portal
                    </div>

                    <h2 style={styles.formTitle}>Welcome back</h2>
                    <p style={styles.formSub}>Sign in to access your dashboard</p>

                    {error && (
                        <div style={styles.errorBox}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                stroke="#a32d2d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Username */}
                        <div style={styles.fieldGroup}>
                            <label style={styles.fieldLabel}>Username</label>
                            <div style={styles.inputWrap}>
                                <span style={styles.inputIcon}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                        stroke="#888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    autoComplete="username"
                                    required
                                    style={styles.input}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = "#1d9e75";
                                        e.target.style.boxShadow = "0 0 0 3px rgba(29,158,117,0.12)";
                                        e.target.style.background = "#fff";
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = "#e0e0e0";
                                        e.target.style.boxShadow = "none";
                                        e.target.style.background = "#f7f8fa";
                                    }}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div style={styles.fieldGroup}>
                            <label style={styles.fieldLabel}>Password</label>
                            <div style={styles.inputWrap}>
                                <span style={styles.inputIcon}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                        stroke="#888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    required
                                    style={styles.input}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = "#1d9e75";
                                        e.target.style.boxShadow = "0 0 0 3px rgba(29,158,117,0.12)";
                                        e.target.style.background = "#fff";
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = "#e0e0e0";
                                        e.target.style.boxShadow = "none";
                                        e.target.style.background = "#f7f8fa";
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={styles.eyeBtn}
                                    title="Toggle password visibility"
                                >
                                    {showPassword ? (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                            stroke="#888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                            <line x1="1" y1="1" x2="23" y2="23" />
                                        </svg>
                                    ) : (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                            stroke="#888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{ ...styles.submitBtn, ...(loading ? styles.submitBtnLoading : {}) }}
                            onMouseEnter={(e) => { if (!loading) e.target.style.background = "#0f3560"; }}
                            onMouseLeave={(e) => { if (!loading) e.target.style.background = "#0a2540"; }}
                        >
                            {loading ? (
                                <>
                                    <span style={styles.spinner} /> Signing in...
                                </>
                            ) : (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                        stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                        <polyline points="10 17 15 12 10 7" />
                                        <line x1="15" y1="12" x2="3" y2="12" />
                                    </svg>
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>

                    <div style={styles.divider}>
                        <div style={styles.dividerLine} />
                        <span style={styles.dividerText}>Authorized personnel only</span>
                        <div style={styles.dividerLine} />
                    </div>

                    <p style={styles.footerNote}>
                        Forgot credentials?{" "}
                        <span style={styles.footerLink}>Contact IT Support</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: {
        display: "flex",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
        backgroundColor: "#f0f2f5",
    },
    leftPanel: {
        width: "38%",
        background: "#0a2540",
        padding: "52px 44px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
    },
    leftTop: {
        position: "relative",
        zIndex: 1,
    },
    brandIcon: {
        width: 48,
        height: 48,
        background: "#1d9e75",
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },
    brandTitle: {
        fontFamily: "Georgia, serif",
        fontSize: 22,
        fontWeight: 600,
        color: "#f0f4f8",
        lineHeight: 1.35,
        marginBottom: 10,
        whiteSpace: "pre-line",
    },
    brandSub: {
        fontSize: 13,
        color: "rgba(200,215,230,0.65)",
        lineHeight: 1.7,
    },
    statsList: {
        display: "flex",
        flexDirection: "column",
        gap: 12,
        position: "relative",
        zIndex: 1,
    },
    statCard: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 16px",
        background: "rgba(255,255,255,0.05)",
        border: "0.5px solid rgba(255,255,255,0.08)",
        borderRadius: 10,
    },
    statDot: {
        width: 8,
        height: 8,
        borderRadius: "50%",
        flexShrink: 0,
    },
    statLabel: {
        fontSize: 13,
        fontWeight: 500,
        color: "#e8f0f8",
        marginBottom: 2,
    },
    statValue: {
        fontSize: 12,
        color: "rgba(200,215,230,0.65)",
    },
    rightPanel: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        background: "#f0f2f5",
    },
    formBox: {
        background: "#fff",
        borderRadius: 16,
        padding: "48px 44px",
        width: "100%",
        maxWidth: 420,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    },
    badge: {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "#1d9e75",
        background: "rgba(29,158,117,0.09)",
        padding: "4px 10px",
        borderRadius: 20,
        marginBottom: 16,
    },
    formTitle: {
        fontFamily: "Georgia, serif",
        fontSize: 28,
        fontWeight: 600,
        color: "#0a2540",
        marginBottom: 6,
    },
    formSub: {
        fontSize: 13,
        color: "#888",
        marginBottom: 28,
    },
    errorBox: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "#fff0f0",
        color: "#a32d2d",
        border: "1px solid #f7c1c1",
        borderRadius: 8,
        padding: "10px 14px",
        fontSize: 13,
        marginBottom: 20,
    },
    fieldGroup: {
        marginBottom: 20,
    },
    fieldLabel: {
        display: "block",
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: "#666",
        marginBottom: 8,
    },
    inputWrap: {
        position: "relative",
        display: "flex",
        alignItems: "center",
    },
    inputIcon: {
        position: "absolute",
        left: 13,
        display: "flex",
        alignItems: "center",
        pointerEvents: "none",
    },
    input: {
        width: "100%",
        padding: "11px 40px 11px 40px",
        fontSize: 14,
        color: "#1a1a1a",
        background: "#f7f8fa",
        border: "1px solid #e0e0e0",
        borderRadius: 8,
        outline: "none",
        transition: "border-color 0.15s, box-shadow 0.15s, background 0.15s",
        boxSizing: "border-box",
    },
    eyeBtn: {
        position: "absolute",
        right: 13,
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        display: "flex",
        alignItems: "center",
        opacity: 0.6,
    },
    submitBtn: {
        width: "100%",
        padding: "13px",
        marginTop: 28,
        background: "#0a2540",
        color: "#fff",
        border: "none",
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 500,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        transition: "background 0.15s, transform 0.1s",
        letterSpacing: "0.02em",
    },
    submitBtnLoading: {
        background: "#0f6e56",
        cursor: "not-allowed",
    },
    spinner: {
        display: "inline-block",
        width: 14,
        height: 14,
        border: "2px solid rgba(255,255,255,0.3)",
        borderTop: "2px solid #fff",
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
    },
    divider: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        margin: "24px 0 0",
    },
    dividerLine: {
        flex: 1,
        height: 0.5,
        background: "#e8e8e8",
    },
    dividerText: {
        fontSize: 11,
        color: "#bbb",
        whiteSpace: "nowrap",
    },
    footerNote: {
        textAlign: "center",
        marginTop: 12,
        fontSize: 12,
        color: "#aaa",
    },
    footerLink: {
        color: "#1d9e75",
        fontWeight: 500,
        cursor: "pointer",
    },
};

export default Login;