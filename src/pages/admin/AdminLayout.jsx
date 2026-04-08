import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard, Users, Image, Trophy, LogOut, GraduationCap, Menu, X, Megaphone, MessageSquare
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const navItems = [
    { to: '/admin-dashboard', icon: <LayoutDashboard size={18} />, label: 'Overview', end: true },
    { to: '/admin-dashboard/applications', icon: <Users size={18} />, label: 'Applications' },
    { to: '/admin-dashboard/messages', icon: <MessageSquare size={18} />, label: 'Messages' },
    { to: '/admin-dashboard/gallery', icon: <Image size={18} />, label: 'Gallery' },
    { to: '/admin-dashboard/achievements', icon: <Trophy size={18} />, label: 'Achievements' },
    { to: '/admin-dashboard/popup-banners', icon: <Megaphone size={18} />, label: 'Popup Banners' },
];

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [newApplicationsCount, setNewApplicationsCount] = useState(0);
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

    const refreshNavCounts = async () => {
        const [applicationsResult, messagesResult] = await Promise.all([
            supabase
                .from('applications')
                .select('id', { head: true, count: 'exact' })
                .or('status.eq.New,status.is.null'),
            supabase
                .from('contact_messages')
                .select('id', { head: true, count: 'exact' })
                .or('is_read.eq.false,is_read.is.null'),
        ]);

        if (!applicationsResult.error) {
            setNewApplicationsCount(applicationsResult.count ?? 0);
        }

        if (!messagesResult.error) {
            setUnreadMessagesCount(messagesResult.count ?? 0);
        }
    };

    useEffect(() => {
        refreshNavCounts();

        const handleDataChanged = () => {
            refreshNavCounts();
        };

        window.addEventListener('admin-data-changed', handleDataChanged);

        const countsChannel = supabase
            .channel('admin-layout-counts')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'applications' },
                () => refreshNavCounts(),
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'contact_messages' },
                () => refreshNavCounts(),
            )
            .subscribe();

        return () => {
            window.removeEventListener('admin-data-changed', handleDataChanged);
            supabase.removeChannel(countsChannel);
        };
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/admin-login');
    };

    return (
        <div className="admin-shell">
            {/* Sidebar */}
            <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
                <div className="admin-sidebar-logo">
                    <div className="admin-sidebar-logo-icon">
                        <GraduationCap size={22} color="#fff" />
                    </div>
                    <div>
                        <div className="admin-sidebar-school">Vidya Vikas</div>
                        <div className="admin-sidebar-sub">Admin Panel</div>
                    </div>
                </div>

                <nav className="admin-sidebar-nav">
                    {navItems.map(item => {
                        const badgeCount = item.label === 'Applications'
                            ? newApplicationsCount
                            : item.label === 'Messages'
                                ? unreadMessagesCount
                                : 0;

                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                className={({ isActive }) =>
                                    `admin-nav-item${isActive ? ' active' : ''}`
                                }
                                onClick={() => setSidebarOpen(false)}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                                {badgeCount > 0 ? (
                                    <span className="admin-badge admin-nav-count-badge">{badgeCount}</span>
                                ) : null}
                            </NavLink>
                        );
                    })}
                </nav>

                <button className="admin-sidebar-logout" onClick={handleLogout}>
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </aside>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Main */}
            <div className="admin-main">
                {/* Top header */}
                <header className="admin-header">
                    <button
                        className="admin-hamburger"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        aria-label={sidebarOpen ? 'Close admin menu' : 'Open admin menu'}
                    >
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                    <div className="admin-header-title">School Admin Dashboard</div>
                    <div className="admin-header-user">
                        <div className="admin-user-avatar">
                            {user?.email?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <div className="admin-user-info">
                            <div className="admin-user-name">Administrator</div>
                            <div className="admin-user-email">{user?.email}</div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="admin-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
