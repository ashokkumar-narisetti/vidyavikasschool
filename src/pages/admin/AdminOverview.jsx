import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, Image, Trophy, FileText } from 'lucide-react';

export default function AdminOverview() {
    const [stats, setStats] = useState({ applications: 0, gallery: 0, achievements: 0 });
    const [recentApps, setRecentApps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const [appRes, galRes, achRes, recentRes] = await Promise.all([
            supabase.from('applications').select('id', { count: 'exact', head: true }),
            supabase.from('gallery').select('id', { count: 'exact', head: true }),
            supabase.from('achievements').select('id', { count: 'exact', head: true }),
            supabase.from('applications').select('*').order('created_at', { ascending: false }).limit(5),
        ]);
        setStats({
            applications: appRes.count ?? 0,
            gallery: galRes.count ?? 0,
            achievements: achRes.count ?? 0,
        });
        setRecentApps(recentRes.data ?? []);
        setLoading(false);
    };

    const cards = [
        { icon: <FileText size={24} />, label: 'Total Applications', value: stats.applications, color: '#1F3C88' },
        { icon: <Image size={24} />, label: 'Gallery Images', value: stats.gallery, color: '#059669' },
        { icon: <Trophy size={24} />, label: 'Achievements', value: stats.achievements, color: '#C8832A' },
        { icon: <Users size={24} />, label: 'Recent (This Month)', value: recentApps.length, color: '#7B2D35' },
    ];

    return (
        <div>
            <div className="admin-page-header">
                <h2 className="admin-page-title">Dashboard Overview</h2>
                <p className="admin-page-sub">Welcome back! Here's what's happening at Vidya Vikas School.</p>
            </div>

            {loading ? (
                <div className="admin-loading">Loading dashboard data...</div>
            ) : (
                <>
                    {/* Stat Cards */}
                    <div className="admin-stats-grid">
                        {cards.map((c, i) => (
                            <div key={i} className="admin-stat-card" style={{ borderTopColor: c.color }}>
                                <div className="admin-stat-icon" style={{ background: `${c.color}18`, color: c.color }}>
                                    {c.icon}
                                </div>
                                <div className="admin-stat-value">{c.value}</div>
                                <div className="admin-stat-label">{c.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Recent Applications */}
                    <div className="admin-card" style={{ marginTop: 32 }}>
                        <div className="admin-card-header">
                            <h3>Recent Applications</h3>
                            <span className="admin-badge">Last 5</span>
                        </div>
                        {recentApps.length === 0 ? (
                            <div className="admin-empty">No applications yet.</div>
                        ) : (
                            <div className="admin-table-wrap">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Student Name</th>
                                            <th>Parent Name</th>
                                            <th>Phone</th>
                                            <th>Class</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentApps.map(app => (
                                            <tr key={app.id}>
                                                <td><strong>{app.student_name}</strong></td>
                                                <td>{app.parent_name}</td>
                                                <td>{app.phone}</td>
                                                <td><span className="admin-badge">{app.class_applied}</span></td>
                                                <td>{new Date(app.created_at).toLocaleDateString('en-IN')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
