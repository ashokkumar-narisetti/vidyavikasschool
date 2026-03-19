import { useEffect, useMemo, useState } from 'react';
import { Eye, Search, Trash2, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const formatDate = (value) => new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
});

const formatDateTime = (value) => new Date(value).toLocaleString('en-IN');

export default function AdminApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [query, setQuery] = useState('');
    const [classFilter, setClassFilter] = useState('all');

    useEffect(() => { fetchApplications(); }, []);

    const fetchApplications = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('applications')
            .select('*')
            .order('created_at', { ascending: false });
        setApplications(data ?? []);
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this application? This cannot be undone.')) return;
        setDeleting(id);
        await supabase.from('applications').delete().eq('id', id);
        setApplications((prev) => prev.filter((a) => a.id !== id));
        if (selected?.id === id) setSelected(null);
        setDeleting(null);
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
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredApplications.map((app, i) => (
                                        <tr key={app.id}>
                                            <td style={{ color: '#94a3b8', fontSize: 13 }}>{i + 1}</td>
                                            <td><strong>{app.student_name}</strong></td>
                                            <td>{app.parent_name}</td>
                                            <td>{app.phone}</td>
                                            <td><span className="admin-badge">{app.class_applied || 'Unspecified'}</span></td>
                                            <td>{formatDate(app.created_at)}</td>
                                            <td>
                                                <div className="admin-app-row-actions">
                                                    <button
                                                        className="admin-icon-btn view"
                                                        onClick={() => setSelected(app)}
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
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="admin-app-mobile-list">
                            {filteredApplications.map((app) => (
                                <article key={app.id} className="admin-app-mobile-card">
                                    <div className="admin-app-mobile-top">
                                        <div>
                                            <div className="admin-app-mobile-name">{app.student_name}</div>
                                            <div className="admin-app-mobile-parent">{app.parent_name}</div>
                                        </div>
                                        <span className="admin-badge">{app.class_applied || 'Unspecified'}</span>
                                    </div>
                                    <div className="admin-app-mobile-meta">{app.phone}</div>
                                    <div className="admin-app-mobile-meta">{formatDate(app.created_at)}</div>
                                    <div className="admin-app-mobile-actions">
                                        <button
                                            className="admin-icon-btn view"
                                            onClick={() => setSelected(app)}
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
                            ))}
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
                            {[
                                ['Student Name', selected.student_name],
                                ['Parent / Guardian', selected.parent_name],
                                ['Phone Number', selected.phone],
                                ['Class Applied', selected.class_applied || 'Unspecified'],
                                ['Submitted On', formatDateTime(selected.created_at)],
                                ['Message', selected.message || '-'],
                            ].map(([label, value]) => (
                                <div className="admin-detail-row" key={label}>
                                    <span className="admin-detail-label">{label}</span>
                                    <span className="admin-detail-value">{value}</span>
                                </div>
                            ))}
                        </div>
                        <div className="admin-modal-footer">
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
