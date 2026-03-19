import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Trash2, Eye, X } from 'lucide-react';

export default function AdminApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [deleting, setDeleting] = useState(null);

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
        setApplications(prev => prev.filter(a => a.id !== id));
        if (selected?.id === id) setSelected(null);
        setDeleting(null);
    };

    return (
        <div>
            <div className="admin-page-header">
                <h2 className="admin-page-title">Admission Applications</h2>
                <p className="admin-page-sub">Manage and review all admission enquiries submitted through the website.</p>
            </div>

            <div className="admin-card">
                <div className="admin-card-header">
                    <h3>All Applications</h3>
                    <span className="admin-badge">{applications.length} total</span>
                </div>

                {loading ? (
                    <div className="admin-loading">Loading applications...</div>
                ) : applications.length === 0 ? (
                    <div className="admin-empty">📭 No applications received yet.</div>
                ) : (
                    <div className="admin-table-wrap">
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
                                {applications.map((app, i) => (
                                    <tr key={app.id}>
                                        <td style={{ color: '#94a3b8', fontSize: 13 }}>{i + 1}</td>
                                        <td><strong>{app.student_name}</strong></td>
                                        <td>{app.parent_name}</td>
                                        <td>{app.phone}</td>
                                        <td><span className="admin-badge">{app.class_applied}</span></td>
                                        <td>{new Date(app.created_at).toLocaleDateString('en-IN')}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 8 }}>
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
                )}
            </div>

            {/* Detail Modal */}
            {selected && (
                <div className="admin-modal-overlay" onClick={() => setSelected(null)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
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
                                ['Class Applied', selected.class_applied],
                                ['Submitted On', new Date(selected.created_at).toLocaleString('en-IN')],
                                ['Message', selected.message || '—'],
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
