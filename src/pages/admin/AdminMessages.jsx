import { useEffect, useMemo, useState } from 'react';
import { Download, Eye, Reply, Search, Trash2, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const formatDate = (value) => new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
});

const formatDateTime = (value) => new Date(value).toLocaleString('en-IN');

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

const isMessageRead = (item) => Boolean(item?.is_read);
const isMessageReplied = (item) => Boolean(item?.is_replied);

export default function AdminMessages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [query, setQuery] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('all');
    const [error, setError] = useState('');
    const [markingReplied, setMarkingReplied] = useState(false);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        setLoading(true);
        setError('');
        const { data, error: fetchError } = await supabase
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (fetchError) {
            setError('Unable to load contact messages. Please check table/policies in Supabase.');
            setMessages([]);
            setLoading(false);
            return;
        }

        setMessages(data ?? []);
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this message? This cannot be undone.')) return;
        setDeleting(id);
        setError('');

        const { error: deleteError } = await supabase.from('contact_messages').delete().eq('id', id);
        if (deleteError) {
            setError('Unable to delete this message right now.');
            setDeleting(null);
            return;
        }

        setMessages((prev) => prev.filter((item) => item.id !== id));
        if (selected?.id === id) setSelected(null);
        setDeleting(null);
        window.dispatchEvent(new Event('admin-data-changed'));
    };

    const updateMessageInState = (id, patch) => {
        setMessages((prev) => prev.map((item) => (
            item.id === id ? { ...item, ...patch } : item
        )));
        setSelected((prev) => (
            prev?.id === id ? { ...prev, ...patch } : prev
        ));
    };

    const handleOpenDetails = async (item) => {
        setSelected(item);

        if (isMessageRead(item)) return;

        const { error: updateError } = await supabase
            .from('contact_messages')
            .update({ is_read: true })
            .eq('id', item.id);

        if (updateError) {
            setError('Unable to mark this message as read right now.');
            return;
        }

        updateMessageInState(item.id, { is_read: true });
        window.dispatchEvent(new Event('admin-data-changed'));
    };

    const handleMarkAsReplied = async () => {
        if (!selected || isMessageReplied(selected)) return;
        setMarkingReplied(true);
        setError('');

        const { error: updateError } = await supabase
            .from('contact_messages')
            .update({ is_replied: true })
            .eq('id', selected.id);

        if (updateError) {
            setError('Unable to mark this message as replied right now.');
            setMarkingReplied(false);
            return;
        }

        updateMessageInState(selected.id, { is_replied: true });
        setMarkingReplied(false);
        window.dispatchEvent(new Event('admin-data-changed'));
    };

    const subjectOptions = useMemo(() => {
        return [...new Set(messages.map((item) => item.subject).filter(Boolean))]
            .sort((a, b) => a.localeCompare(b));
    }, [messages]);

    const filteredMessages = useMemo(() => {
        const normalized = query.trim().toLowerCase();
        return messages.filter((item) => {
            const matchesSubject = subjectFilter === 'all' || item.subject === subjectFilter;
            if (!normalized) return matchesSubject;

            const haystack = [
                item.name || item.full_name,
                item.phone,
                item.email,
                item.subject,
                item.message,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

            return matchesSubject && haystack.includes(normalized);
        });
    }, [messages, subjectFilter, query]);

    const stats = useMemo(() => {
        const now = new Date();
        const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const startWeek = Date.now() - (7 * 24 * 60 * 60 * 1000);

        let today = 0;
        let week = 0;

        messages.forEach((item) => {
            const time = new Date(item.created_at).getTime();
            if (time >= startToday) today += 1;
            if (time >= startWeek) week += 1;
        });

        return {
            total: messages.length,
            today,
            week,
        };
    }, [messages]);

    const handleExport = () => {
        const rows = filteredMessages.map((item, i) => [
            i + 1,
            item.name || item.full_name || '',
            item.phone || '',
            item.email || '',
            item.subject || 'General',
            item.message || '',
            formatDate(item.created_at),
            isMessageRead(item) ? 'Read' : 'Unread',
            isMessageReplied(item) ? 'Yes' : 'No',
        ]);

        downloadCsv(
            `messages-export-${new Date().toISOString().slice(0, 10)}.csv`,
            ['#', 'Name', 'Phone Number', 'Email', 'Subject', 'Message', 'Date', 'Status (Read/Unread)', 'Replied'],
            rows,
        );
    };

    return (
        <div className="admin-applications-shell">
            <div className="admin-page-header admin-applications-header">
                <div>
                    <h2 className="admin-page-title">Contact Messages</h2>
                    <p className="admin-page-sub">
                        Manage messages submitted from the public contact page.
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
                        <label>Search Message</label>
                        <div className="admin-app-search-wrap">
                            <Search size={16} />
                            <input
                                type="text"
                                className="admin-input"
                                placeholder="Name, email, phone, subject..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="admin-form-group">
                        <label>Subject Filter</label>
                        <select
                            className="admin-input"
                            value={subjectFilter}
                            onChange={(e) => setSubjectFilter(e.target.value)}
                        >
                            <option value="all">All Subjects</option>
                            {subjectOptions.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="admin-card">
                <div className="admin-card-header admin-app-list-header">
                    <h3>Messages List</h3>
                    <div className="admin-app-list-meta">
                        <button className="admin-btn-secondary" onClick={handleExport}>
                            <Download size={14} /> Export CSV
                        </button>
                        <span className="admin-badge">{filteredMessages.length} shown</span>
                        {filteredMessages.length !== messages.length ? (
                            <span className="admin-app-list-muted">of {messages.length} total</span>
                        ) : null}
                    </div>
                </div>

                {loading ? (
                    <div className="admin-loading">Loading messages...</div>
                ) : filteredMessages.length === 0 ? (
                    <div className="admin-empty">No messages match your current filters.</div>
                ) : (
                    <>
                        <div className="admin-table-wrap admin-app-desktop-table">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th />
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Phone</th>
                                        <th>Email</th>
                                        <th>Subject</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredMessages.map((item, i) => {
                                        const unread = !isMessageRead(item);
                                        const replied = isMessageReplied(item);
                                        const rowTextStyle = { fontWeight: unread ? 700 : 400 };

                                        return (
                                            <tr key={item.id}>
                                                <td style={{ width: 26 }}>
                                                    {unread ? <span className="admin-unread-dot" title="Unread" /> : null}
                                                </td>
                                                <td style={{ color: '#94a3b8', fontSize: 13 }}>{i + 1}</td>
                                                <td style={rowTextStyle}>{item.name || item.full_name || '-'}</td>
                                                <td style={rowTextStyle}>{item.phone}</td>
                                                <td style={rowTextStyle}>{item.email}</td>
                                                <td style={rowTextStyle}>
                                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                                                        <span className="admin-badge">{item.subject || 'General'}</span>
                                                        {replied ? (
                                                            <span className="admin-badge admin-replied-badge">Replied</span>
                                                        ) : null}
                                                    </div>
                                                </td>
                                                <td style={rowTextStyle}>{formatDate(item.created_at)}</td>
                                                <td>
                                                    <div className="admin-app-row-actions">
                                                        <button
                                                            className="admin-icon-btn view"
                                                            onClick={() => handleOpenDetails(item)}
                                                            title="View Details"
                                                        >
                                                            <Eye size={15} />
                                                        </button>
                                                        <button
                                                            className="admin-icon-btn delete"
                                                            onClick={() => handleDelete(item.id)}
                                                            disabled={deleting === item.id}
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
                            {filteredMessages.map((item) => {
                                const unread = !isMessageRead(item);
                                const replied = isMessageReplied(item);
                                const rowTextStyle = { fontWeight: unread ? 700 : 400 };

                                return (
                                    <article key={item.id} className="admin-app-mobile-card">
                                        <div className="admin-app-mobile-top">
                                            <div>
                                                <div className="admin-app-mobile-name" style={{ ...rowTextStyle, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                                    {unread ? <span className="admin-unread-dot" title="Unread" /> : null}
                                                    <span>{item.name || item.full_name || '-'}</span>
                                                </div>
                                                <div className="admin-app-mobile-parent" style={rowTextStyle}>{item.email}</div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                                <span className="admin-badge">{item.subject || 'General'}</span>
                                                {replied ? (
                                                    <span className="admin-badge admin-replied-badge">Replied</span>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="admin-app-mobile-meta" style={rowTextStyle}>{item.phone}</div>
                                        <div className="admin-app-mobile-meta" style={rowTextStyle}>{formatDate(item.created_at)}</div>
                                        <div className="admin-app-mobile-actions">
                                            <button
                                                className="admin-icon-btn view"
                                                onClick={() => handleOpenDetails(item)}
                                                title="View Details"
                                            >
                                                <Eye size={15} />
                                            </button>
                                            <button
                                                className="admin-icon-btn delete"
                                                onClick={() => handleDelete(item.id)}
                                                disabled={deleting === item.id}
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
                            <h3>Message Details</h3>
                            <button onClick={() => setSelected(null)} className="admin-modal-close">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="admin-modal-body">
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Name</span>
                                <span className="admin-detail-value">{selected.name || selected.full_name || '-'}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Phone Number</span>
                                <span className="admin-detail-value">{selected.phone}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Email</span>
                                <span className="admin-detail-value">{selected.email}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Subject</span>
                                <span className="admin-detail-value">{selected.subject || 'General'}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Status</span>
                                <span className="admin-detail-value">{isMessageRead(selected) ? 'Read' : 'Unread'}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Replied</span>
                                <span className="admin-detail-value">{isMessageReplied(selected) ? 'Yes' : 'No'}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Message</span>
                                <span className="admin-detail-value" style={{ whiteSpace: 'pre-wrap' }}>
                                    {selected.message || '-'}
                                </span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Submitted On</span>
                                <span className="admin-detail-value">{formatDateTime(selected.created_at)}</span>
                            </div>
                        </div>
                        <div className="admin-modal-footer">
                            <button className="admin-btn-danger" onClick={() => handleDelete(selected.id)}>
                                <Trash2 size={14} /> Delete Message
                            </button>
                            <button
                                className="admin-btn-primary"
                                onClick={handleMarkAsReplied}
                                disabled={markingReplied || isMessageReplied(selected)}
                            >
                                <Reply size={14} /> {isMessageReplied(selected) ? 'Marked Replied' : (markingReplied ? 'Marking...' : 'Mark as Replied')}
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
