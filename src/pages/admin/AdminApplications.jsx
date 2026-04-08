import { useEffect, useMemo, useState } from 'react';
import { Download, Eye, Search, Trash2, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const APPLICATION_STATUSES = ['New', 'Under Review', 'Shortlisted', 'Admitted', 'Rejected'];

const STATUS_BADGE_STYLES = {
    New: { background: '#dbeafe', color: '#1d4ed8' },
    'Under Review': { background: '#fef3c7', color: '#b45309' },
    Shortlisted: { background: '#ede9fe', color: '#6d28d9' },
    Admitted: { background: '#dcfce7', color: '#166534' },
    Rejected: { background: '#fee2e2', color: '#b91c1c' },
};

const formatDate = (value) => new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
});

const formatDateTime = (value) => new Date(value).toLocaleString('en-IN');

const normalizeApplicationStatus = (value) => (
    APPLICATION_STATUSES.includes(value) ? value : 'New'
);

const csvCell = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;

const downloadCsv = (fileName, headers, rows) => {
    const csv = [
        headers.map(csvCell).join(','),
        ...rows.map((row) => row.map(csvCell).join(',')),
    ].join('\n');

    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export default function AdminApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [query, setQuery] = useState('');
    const [classFilter, setClassFilter] = useState('all');
    const [error, setError] = useState('');
    const [modalStatus, setModalStatus] = useState('New');
    const [savingStatus, setSavingStatus] = useState(false);

    useEffect(() => { fetchApplications(); }, []);

    useEffect(() => {
        if (!selected) return;
        setModalStatus(normalizeApplicationStatus(selected.status));
    }, [selected]);

    const fetchApplications = async () => {
        setLoading(true);
        setError('');

        const { data, error: fetchError } = await supabase
            .from('applications')
            .select('*')
            .order('created_at', { ascending: false });

        if (fetchError) {
            setError('Unable to load applications right now.');
            setApplications([]);
            setLoading(false);
            return;
        }

        setApplications(data ?? []);
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this application? This cannot be undone.')) return;
        setDeleting(id);
        setError('');

        const { error: deleteError } = await supabase.from('applications').delete().eq('id', id);
        if (deleteError) {
            setError('Unable to delete this application right now.');
            setDeleting(null);
            return;
        }

        setApplications((prev) => prev.filter((a) => a.id !== id));
        if (selected?.id === id) setSelected(null);
        setDeleting(null);
        window.dispatchEvent(new Event('admin-data-changed'));
    };

    const handleOpenDetails = (app) => {
        setSelected(app);
    };

    const handleSaveStatus = async () => {
        if (!selected) return;
        const currentStatus = normalizeApplicationStatus(selected.status);
        if (modalStatus === currentStatus) return;

        setSavingStatus(true);
        setError('');

        const { error: updateError } = await supabase
            .from('applications')
            .update({ status: modalStatus })
            .eq('id', selected.id);

        if (updateError) {
            setError('Unable to update application status right now.');
            setSavingStatus(false);
            return;
        }

        setApplications((prev) => prev.map((app) => (
            app.id === selected.id ? { ...app, status: modalStatus } : app
        )));
        setSelected((prev) => (prev ? { ...prev, status: modalStatus } : prev));
        setSavingStatus(false);
        window.dispatchEvent(new Event('admin-data-changed'));
    };

    const classOptions = useMemo(() => {
        return [...new Set(applications.map((app) => app.class_applied).filter(Boolean))]
            .sort((a, b) => a.localeCompare(b));
    }, [applications]);

    const filteredApplications = useMemo(() => {
        const normalized = query.trim().toLowerCase();
        return applications.filter((app) => {
            const matchesClass = classFilter === 'all' || app.class_applied === classFilter;
            if (!normalized) return matchesClass;

            const haystack = [
                app.student_name,
                app.parent_name,
                app.phone,
                app.class_applied,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

            return matchesClass && haystack.includes(normalized);
        });
    }, [applications, classFilter, query]);

    const stats = useMemo(() => {
        const now = new Date();
        const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const startWeek = Date.now() - (7 * 24 * 60 * 60 * 1000);

        let today = 0;
        let week = 0;

        applications.forEach((app) => {
            const time = new Date(app.created_at).getTime();
            if (time >= startToday) today += 1;
            if (time >= startWeek) week += 1;
        });

        return {
            total: applications.length,
            today,
            week,
        };
    }, [applications]);

    const handleExport = () => {
        const rows = filteredApplications.map((app, i) => [
            i + 1,
            app.student_name || '',
            app.parent_name || '',
            app.phone || '',
            app.class_applied || 'Unspecified',
            normalizeApplicationStatus(app.status),
            formatDate(app.created_at),
        ]);

        downloadCsv(
            `applications-export-${new Date().toISOString().slice(0, 10)}.csv`,
            ['#', 'Student Name', 'Parent/Guardian', 'Phone Number', 'Class Applied', 'Status', 'Date Submitted'],
            rows,
        );
    };

    const selectedMessage = (selected?.message ?? '').trim();

    return (
        <div className="admin-applications-shell">
            <div className="admin-page-header admin-applications-header">
                <div>
                    <h2 className="admin-page-title">Admission Applications</h2>
                    <p className="admin-page-sub">
                        Review enquiries, find specific applicants quickly, and take actions without scrolling through clutter.
                    </p>
                </div>
                <div className="admin-app-kpis">
                    <div className="admin-app-kpi">
                        <span>Total</span>
                        <strong>{stats.total}</strong>
                    </div>
                    <div className="admin-app-kpi">
                        <span>Today</span>
                        <strong>{stats.today}</strong>
                    </div>
                    <div className="admin-app-kpi">
                        <span>7 Days</span>
                        <strong>{stats.week}</strong>
                    </div>
                </div>
            </div>

            {error && <div className="admin-error-banner" style={{ marginBottom: 12 }}>{error}</div>}

            <div className="admin-card admin-app-toolbar">
                <div className="admin-app-filter-grid">
                    <div className="admin-form-group">
                        <label>Search Applicant</label>
                        <div className="admin-app-search-wrap">
                            <Search size={16} />
                            <input
                                type="text"
                                className="admin-input"
                                placeholder="Student, parent, phone..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="admin-form-group">
                        <label>Class Filter</label>
                        <select
                            className="admin-input"
                            value={classFilter}
                            onChange={(e) => setClassFilter(e.target.value)}
                        >
                            <option value="all">All Classes</option>
                            {classOptions.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="admin-card">
                <div className="admin-card-header admin-app-list-header">
                    <h3>Applications List</h3>
                    <div className="admin-app-list-meta">
                        <button className="admin-btn-secondary" onClick={handleExport}>
                            <Download size={14} /> Export CSV
                        </button>
                        <span className="admin-badge">{filteredApplications.length} shown</span>
                        {filteredApplications.length !== applications.length ? (
                            <span className="admin-app-list-muted">of {applications.length} total</span>
                        ) : null}
                    </div>
                </div>

                {loading ? (
                    <div className="admin-loading">Loading applications...</div>
                ) : filteredApplications.length === 0 ? (
                    <div className="admin-empty">No applications match your current filters.</div>
                ) : (
                    <>
                        <div className="admin-table-wrap admin-app-desktop-table">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Student Name</th>
                                        <th>Parent Name</th>
                                        <th>Phone</th>
                                        <th>Class</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredApplications.map((app, i) => {
                                        const status = normalizeApplicationStatus(app.status);
                                        const isNew = status === 'New';
                                        const rowTextStyle = { fontWeight: isNew ? 700 : 400 };

                                        return (
                                            <tr key={app.id}>
                                                <td style={{ color: '#94a3b8', fontSize: 13 }}>{i + 1}</td>
                                                <td style={rowTextStyle}>{app.student_name}</td>
                                                <td style={rowTextStyle}>{app.parent_name}</td>
                                                <td style={rowTextStyle}>{app.phone}</td>
                                                <td style={rowTextStyle}>
                                                    <span className="admin-badge">{app.class_applied || 'Unspecified'}</span>
                                                </td>
                                                <td>
                                                    <span className="admin-badge" style={STATUS_BADGE_STYLES[status]}>
                                                        {status}
                                                    </span>
                                                </td>
                                                <td style={rowTextStyle}>{formatDate(app.created_at)}</td>
                                                <td>
                                                    <div className="admin-app-row-actions">
                                                        <button
                                                            className="admin-icon-btn view"
                                                            onClick={() => handleOpenDetails(app)}
                                                            title="View Details"
                                                        >
                                                            <Eye size={15} />
                                                        </button>
                                                        <button
                                                            className="admin-icon-btn delete"
                                                            onClick={() => handleDelete(app.id)}
                                                            disabled={deleting === app.id}
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="admin-app-mobile-list">
                            {filteredApplications.map((app) => {
                                const status = normalizeApplicationStatus(app.status);
                                const isNew = status === 'New';
                                const rowTextStyle = { fontWeight: isNew ? 700 : 400 };

                                return (
                                    <article key={app.id} className="admin-app-mobile-card">
                                        <div className="admin-app-mobile-top">
                                            <div>
                                                <div className="admin-app-mobile-name" style={rowTextStyle}>{app.student_name}</div>
                                                <div className="admin-app-mobile-parent" style={rowTextStyle}>{app.parent_name}</div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                                <span className="admin-badge">{app.class_applied || 'Unspecified'}</span>
                                                <span className="admin-badge" style={STATUS_BADGE_STYLES[status]}>
                                                    {status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="admin-app-mobile-meta" style={rowTextStyle}>{app.phone}</div>
                                        <div className="admin-app-mobile-meta" style={rowTextStyle}>{formatDate(app.created_at)}</div>
                                        <div className="admin-app-mobile-actions">
                                            <button
                                                className="admin-icon-btn view"
                                                onClick={() => handleOpenDetails(app)}
                                                title="View Details"
                                            >
                                                <Eye size={15} />
                                            </button>
                                            <button
                                                className="admin-icon-btn delete"
                                                onClick={() => handleDelete(app.id)}
                                                disabled={deleting === app.id}
                                                title="Delete"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            {selected && (
                <div className="admin-modal-overlay" onClick={() => setSelected(null)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h3>Application Details</h3>
                            <button onClick={() => setSelected(null)} className="admin-modal-close">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="admin-modal-body">
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Student Name</span>
                                <span className="admin-detail-value">{selected.student_name}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Parent / Guardian</span>
                                <span className="admin-detail-value">{selected.parent_name}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Phone Number</span>
                                <span className="admin-detail-value">{selected.phone}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Class Applied</span>
                                <span className="admin-detail-value">{selected.class_applied || 'Unspecified'}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Status</span>
                                <span className="admin-detail-value" style={{ width: '100%', maxWidth: 240 }}>
                                    <select
                                        className="admin-input"
                                        value={modalStatus}
                                        onChange={(e) => setModalStatus(e.target.value)}
                                    >
                                        {APPLICATION_STATUSES.map((status) => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Submitted On</span>
                                <span className="admin-detail-value">{formatDateTime(selected.created_at)}</span>
                            </div>
                            {selectedMessage && (
                                <div className="admin-detail-row">
                                    <span className="admin-detail-label">Message</span>
                                    <span className="admin-detail-value" style={{ whiteSpace: 'pre-wrap' }}>
                                        {selectedMessage}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="admin-modal-footer">
                            <button
                                className="admin-btn-primary"
                                onClick={handleSaveStatus}
                                disabled={savingStatus || modalStatus === normalizeApplicationStatus(selected.status)}
                            >
                                {savingStatus ? 'Saving...' : 'Save Status'}
                            </button>
                            <button className="admin-btn-danger" onClick={() => handleDelete(selected.id)}>
                                <Trash2 size={14} /> Delete Application
                            </button>
                            <button className="admin-btn-secondary" onClick={() => setSelected(null)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
