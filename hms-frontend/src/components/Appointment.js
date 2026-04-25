import React, { useState, useEffect } from "react";
import API from "../api";

const STATUS_CONFIG = {
    Pending:   { bg: "#fff7e6", color: "#b45309", border: "#fcd34d" },
    Confirmed: { bg: "#e6f4ff", color: "#1d4ed8", border: "#93c5fd" },
    Completed: { bg: "#e6faf3", color: "#065f46", border: "#6ee7b7" },
    Cancelled: { bg: "#fef2f2", color: "#991b1b", border: "#fca5a5" },
};

function Appointment() {
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        patient: "",
        doctor: "",
        appointment_date: "",
        appointment_time: "",
        reason: "",
        status: "Pending"
    });

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [appointmentsRes, patientsRes, doctorsRes] = await Promise.all([
                API.get("appointments/"),
                API.get("patients/"),
                API.get("doctors/")
            ]);
            console.log("Appointments:", appointmentsRes.data);
            setAppointments(appointmentsRes.data);
            setPatients(patientsRes.data);
            setDoctors(doctorsRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post("appointments/", formData);
            alert("Appointment booked successfully!");
            setShowForm(false);
            setFormData({ patient: "", doctor: "", appointment_date: "", appointment_time: "", reason: "", status: "Pending" });
            fetchData();
        } catch (error) {
            console.error("Error:", error);
            alert("Error booking appointment.");
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await API.patch(`appointments/${id}/`, { status: newStatus });
            alert(`Appointment ${newStatus}!`);
            fetchData();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const deleteAppointment = async (id) => {
        if (window.confirm("Are you sure you want to delete this appointment?")) {
            try {
                await API.delete(`appointments/${id}/`);
                alert("Appointment deleted!");
                fetchData();
            } catch (error) {
                alert("Error deleting appointment");
            }
        }
    };

    if (loading) {
        return (
            <div style={styles.loadingScreen}>
                <div style={styles.loadingSpinner} />
                <p style={{ color: "#64748b", marginTop: 16, fontSize: 14 }}>Loading appointments...</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div>
                    <div style={styles.headerBadge}>Appointment Management</div>
                    <h1 style={styles.pageTitle}>Appointments</h1>
                    <p style={styles.pageSubtitle}>{appointments.length} total appointment{appointments.length !== 1 ? "s" : ""}</p>
                </div>
                <button onClick={() => setShowForm(true)} style={styles.addButton}>+ Book Appointment</button>
            </div>

            {/* Summary Cards */}
            <div style={styles.statsRow}>
                {Object.entries(STATUS_CONFIG).map(([status, cfg]) => (
                    <div key={status} style={{ ...styles.statCard, borderTop: `3px solid ${cfg.border}` }}>
                        <div style={{ fontSize: 22, fontWeight: 700, color: cfg.color }}>
                            {appointments.filter(a => a.status === status).length}
                        </div>
                        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{status}</div>
                    </div>
                ))}
            </div>

            {/* Modal Form */}
            {showForm && (
                <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
                    <div style={styles.modal}>
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitle}>Book New Appointment</h2>
                            <button onClick={() => setShowForm(false)} style={styles.closeBtn}>✕</button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ padding: "0 28px 28px" }}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Select Patient *</label>
                                <select name="patient" value={formData.patient} onChange={handleInputChange} required style={styles.select}>
                                    <option value="">-- Select Patient --</option>
                                    {patients.map(p => (
                                        <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Select Doctor *</label>
                                <select name="doctor" value={formData.doctor} onChange={handleInputChange} required style={styles.select}>
                                    <option value="">-- Select Doctor --</option>
                                    {doctors.map(d => (
                                        <option key={d.id} value={d.id}>Dr. {d.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={styles.formRow}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Date *</label>
                                    <input type="date" name="appointment_date" value={formData.appointment_date} onChange={handleInputChange} required style={styles.input} />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Time *</label>
                                    <input type="time" name="appointment_time" value={formData.appointment_time} onChange={handleInputChange} required style={styles.input} />
                                </div>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Reason</label>
                                <textarea name="reason" value={formData.reason} onChange={handleInputChange} rows="3" placeholder="Reason for appointment..." style={styles.textarea} />
                            </div>
                            <div style={styles.modalFooter}>
                                <button type="button" onClick={() => setShowForm(false)} style={styles.cancelBtn}>Cancel</button>
                                <button type="submit" style={styles.saveBtn}>Book Appointment</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Appointments Table */}
            <div style={styles.tableCard}>
                <div style={styles.tableScrollWrap}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>#</th>
                                <th style={styles.th}>Patient</th>
                                <th style={styles.th}>Doctor</th>
                                <th style={styles.th}>Date</th>
                                <th style={styles.th}>Time</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={styles.emptyCell}>
                                        <div>No appointments found. Click "Book Appointment" to add one.</div>
                                    </td>
                                </tr>
                            ) : (
                                appointments.map((apt, idx) => (
                                    <tr key={apt.id}>
                                        <td style={styles.td}>{idx + 1}</td>
                                        <td style={styles.td}>
                                            {apt.patient_details?.first_name} {apt.patient_details?.last_name || apt.patient?.first_name} {apt.patient?.last_name}
                                        </td>
                                        <td style={styles.td}>
                                            Dr. {apt.doctor_details?.name || apt.doctor?.name || "Unknown"}
                                        </td>
                                        <td style={styles.td}>{apt.appointment_date}</td>
                                        <td style={styles.td}>{apt.appointment_time}</td>
                                        <td style={styles.td}>
                                            <select 
                                                value={apt.status} 
                                                onChange={(e) => updateStatus(apt.id, e.target.value)} 
                                                style={{
                                                    ...styles.statusSelect,
                                                    background: STATUS_CONFIG[apt.status]?.bg || "#f8fafc",
                                                    color: STATUS_CONFIG[apt.status]?.color || "#334155",
                                                    borderColor: STATUS_CONFIG[apt.status]?.border || "#e2e8f0",
                                                }}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Confirmed">Confirmed</option>
                                                <option value="Completed">Completed</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={styles.actionGroup}>
                                                <button onClick={() => updateStatus(apt.id, "Completed")} style={styles.completeBtn}>Done</button>
                                                <button onClick={() => updateStatus(apt.id, "Cancelled")} style={styles.cancelAppointmentBtn}>Cancel</button>
                                                <button onClick={() => deleteAppointment(apt.id)} style={styles.deleteBtn}>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: "28px 32px",
        background: "#f8fafc",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    },
    loadingScreen: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
    },
    loadingSpinner: {
        width: 36,
        height: 36,
        border: "3px solid #e2e8f0",
        borderTop: "3px solid #1d9e75",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 28,
    },
    headerBadge: {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        color: "#1d9e75",
        background: "rgba(29,158,117,0.09)",
        padding: "4px 10px",
        borderRadius: 20,
        marginBottom: 10,
    },
    pageTitle: {
        fontSize: 26,
        fontWeight: 700,
        color: "#0f172a",
        margin: 0,
    },
    pageSubtitle: {
        fontSize: 13,
        color: "#94a3b8",
        marginTop: 4,
    },
    addButton: {
        backgroundColor: "#1d9e75",
        color: "white",
        padding: "10px 20px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: 500,
    },
    statsRow: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16,
        marginBottom: 28,
    },
    statCard: {
        background: "#fff",
        borderRadius: 10,
        padding: "16px 20px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    },
    overlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(2px)",
    },
    modal: {
        background: "#fff",
        borderRadius: 14,
        width: "100%",
        maxWidth: 560,
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
    },
    modalHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "24px 28px 20px",
        borderBottom: "1px solid #f1f5f9",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 700,
        color: "#0f172a",
        margin: 0,
    },
    closeBtn: {
        background: "none",
        border: "none",
        fontSize: "20px",
        cursor: "pointer",
        color: "#64748b",
    },
    formGroup: {
        marginBottom: 20,
    },
    formRow: {
        display: "flex",
        gap: 16,
        marginBottom: 0,
    },
    label: {
        display: "block",
        fontSize: 12,
        fontWeight: 500,
        color: "#64748b",
        marginBottom: 6,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
    },
    select: {
        width: "100%",
        padding: "10px 12px",
        fontSize: 14,
        color: "#1e293b",
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: 8,
        outline: "none",
        cursor: "pointer",
    },
    input: {
        width: "100%",
        padding: "10px 12px",
        fontSize: 14,
        color: "#1e293b",
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: 8,
        outline: "none",
        boxSizing: "border-box",
    },
    textarea: {
        width: "100%",
        padding: "10px 12px",
        fontSize: 14,
        color: "#1e293b",
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: 8,
        outline: "none",
        resize: "vertical",
        fontFamily: "inherit",
        boxSizing: "border-box",
    },
    modalFooter: {
        display: "flex",
        justifyContent: "flex-end",
        gap: 10,
        padding: "20px 28px",
        borderTop: "1px solid #f1f5f9",
        marginTop: 10,
    },
    cancelBtn: {
        background: "#fff",
        color: "#64748b",
        border: "1px solid #e2e8f0",
        borderRadius: 8,
        padding: "10px 20px",
        fontSize: 14,
        cursor: "pointer",
        fontWeight: 500,
    },
    saveBtn: {
        background: "#1d9e75",
        color: "#fff",
        border: "none",
        borderRadius: 8,
        padding: "10px 20px",
        fontSize: 14,
        cursor: "pointer",
        fontWeight: 500,
    },
    tableCard: {
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
        overflow: "hidden",
    },
    tableScrollWrap: { overflowX: "auto" },
    table: { width: "100%", borderCollapse: "collapse" },
    th: {
        background: "#0f172a",
        color: "#e2e8f0",
        padding: "13px 16px",
        textAlign: "left",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
    },
    td: {
        padding: "12px 16px",
        borderBottom: "1px solid #f1f5f9",
        verticalAlign: "middle",
        fontSize: 14,
    },
    emptyCell: {
        padding: "60px 20px",
        textAlign: "center",
        color: "#94a3b8",
    },
    statusSelect: {
        padding: "5px 10px",
        borderRadius: 6,
        border: "1px solid #e2e8f0",
        fontSize: 12,
        fontWeight: 500,
        cursor: "pointer",
        outline: "none",
    },
    actionGroup: {
        display: "flex",
        gap: 6,
        flexWrap: "wrap",
    },
    completeBtn: {
        background: "#1d9e75",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        padding: "5px 10px",
        fontSize: 12,
        fontWeight: 500,
        cursor: "pointer",
    },
    cancelAppointmentBtn: {
        background: "#d97706",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        padding: "5px 10px",
        fontSize: 12,
        fontWeight: 500,
        cursor: "pointer",
    },
    deleteBtn: {
        background: "#dc2626",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        padding: "5px 10px",
        fontSize: 12,
        fontWeight: 500,
        cursor: "pointer",
    },
};

export default Appointment;