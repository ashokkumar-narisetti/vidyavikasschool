import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, FileText, Image, PieChart, Trophy, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const formatDate = (value) => new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
});

export default function AdminOverview() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ applications: 0, gallery: 0, achievements: 0 });
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const [appsRes, galRes, achRes] = await Promise.all([
            supabase
                .from('applications')
                .select('id, student_name, parent_name, phone, class_applied, created_at')
                .order('created_at', { ascending: false }),
            supabase.from('gallery').select('id', { count: 'exact', head: true }),
            supabase.from('achievements').select('id', { count: 'exact', head: true }),
        ]);

        const appData = appsRes.data ?? [];

        setApplications(appData);
        setStats({
            applications: appData.length,
            gallery: galRes.count ?? 0,
            achievements: achRes.count ?? 0,
        });
        setLoading(false);
    };

    const recentApps = useMemo(() => applications.slice(0, 6), [applications]);

    const applicationsToday = useMemo(() => {
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
        const end = start + (24 * 60 * 60 * 1000);
        return applications.filter((app) => {
            const time = new Date(app.created_at).getTime();
            return time >= start && time < end;
        }).length;
    }, [applications]);

    const applicationsThisWeek = useMemo(() => {
        const now = Date.now();
        const weekAgo = now - (7 * 24 * 60 * 60 * 1000);
        return applications.filter((app) => new Date(app.created_at).getTime() >= weekAgo).length;
    }, [applications]);

    const classDistribution = useMemo(() => {
        const counts = applications.reduce((acc, app) => {
            const key = app.class_applied?.trim() || 'Unspecified';
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});
        const total = applications.length || 1;

        return Object.entries(counts)
            .map(([name, count]) => ({
                name,
                count,
                percent: Math.round((count / total) * 100),
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 6);
    }, [applications]);

    const cards = [
        {
            icon: <FileText size={24} />,
            label: 'Total Applications',
            value: stats.applications,
            color: '#1F3C88',
            trend: `${applicationsThisWeek} received in the last 7 days`,
        },
        {
            icon: <Image size={24} />,
            label: 'Gallery Images',
            value: stats.gallery,
            color: '#059669',
            trend: 'Visual highlights managed from one place',
        },
        {
            icon: <Trophy size={24} />,
            label: 'Achievements',
            value: stats.achievements,
            color: '#C8832A',
            trend: 'Student performance records available',
        },
        {
            icon: <Users size={24} />,
            label: 'Today Admissions',
            value: applicationsToday,
            color: '#7B2D35',
            trend: 'New submissions received today',
        },
    ];

    return (
        <div className="admin-overview-shell">
            <div className="admin-overview-hero">
                <div>
                    <div className="admin-overview-kicker">Admin Insights</div>
                    <h2 className="admin-page-title">Dashboard Overview</h2>
                    <p className="admin-page-sub">
                        Track admissions, student achievements, and media updates from one place.
                    </p>
                </div>
                <div className="admin-overview-hero-actions">
                    <button className="admin-btn-secondary" onClick={() => navigate('/admin-dashboard/applications')}>
                        View Applications
                        <ArrowUpRight size={14} />
                    </button>
                    <button className="admin-btn-secondary" onClick={() => navigate('/admin-dashboard/popup-banners')}>
                        Manage Banners
                        <ArrowUpRight size={14} />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="admin-loading">Loading dashboard data...</div>
            ) : (
                <>
                    <div className="admin-stats-grid admin-overview-stats-grid">
                        {cards.map((card) => (
                            <div key={card.label} className="admin-stat-card admin-overview-stat-card" style={{ borderTopColor: card.color }}>
                                <div className="admin-stat-icon" style={{ background: `${card.color}18`, color: card.color }}>
                                    {card.icon}
                                </div>
                                <div className="admin-stat-value">{card.value}</div>
                                <div className="admin-stat-label">{card.label}</div>
                                <div className="admin-stat-trend">{card.trend}</div>
                            </div>
                        ))}
                    </div>

                    <div className="admin-overview-panels">
                        <div className="admin-card admin-overview-panel">
                            <div className="admin-card-header">
                                <h3>Recent Applications</h3>
                                <span className="admin-badge">{recentApps.length} latest</span>
                            </div>
                            {recentApps.length === 0 ? (
                                <div className="admin-empty">No applications yet.</div>
                            ) : (
                                <ul className="admin-recent-list">
                                    {recentApps.map((app) => (
                                        <li key={app.id} className="admin-recent-item">
                                            <div className="admin-recent-primary">
                                                <div className="admin-recent-name">{app.student_name}</div>
                                                <div className="admin-recent-meta">{app.parent_name} | {app.phone}</div>
                                            </div>
                                            <div className="admin-recent-side">
                                                <span className="admin-badge">{app.class_applied || 'Unspecified'}</span>
                                                <span className="admin-recent-date">{formatDate(app.created_at)}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="admin-card admin-overview-panel">
                            <div className="admin-card-header">
                                <h3>Class-wise Demand</h3>
                                <span className="admin-badge">
                                    <PieChart size={12} /> Trend
                                </span>
                            </div>
                            {classDistribution.length === 0 ? (
                                <div className="admin-empty">No class distribution available yet.</div>
                            ) : (
                                <ul className="admin-distribution-list">
                                    {classDistribution.map((item) => (
                                        <li key={item.name} className="admin-distribution-item">
                                            <div className="admin-distribution-top">
                                                <span>{item.name}</span>
                                                <strong>{item.count}</strong>
                                            </div>
                                            <div className="admin-distribution-track">
                                                <span style={{ width: `${item.percent}%` }} />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
