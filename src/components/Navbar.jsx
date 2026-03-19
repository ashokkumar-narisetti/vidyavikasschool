import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Academics', path: '/academics' },
    { label: 'Admissions', path: '/admissions' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Achievements', path: '/achievements' },
    { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNav = (path) => {
        setMobileOpen(false);
        if (path.startsWith('/#')) {
            navigate('/');
            setTimeout(() => {
                const id = path.replace('/#', '');
                const el = document.getElementById(id);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            navigate(path);
            window.scrollTo(0, 0);
        }
    };

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path) && !path.startsWith('/#');
    };

    return (
        <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
            <div className="container">
                <div className="navbar-inner">
                    <div
                        className="navbar-logo"
                        onClick={() => handleNav('/')}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="logo-icon">
                            <img
                                src="/vidyavikaslogo.jpeg"
                                alt="Vidya Vikas School Logo"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                }}
                            />
                        </div>
                        <div className="logo-text">
                            <div className="logo-title">VIDYAVIKAS</div>
                            <span className="logo-subtitle">[E.M] Blooms, Primary &amp; High School - Gudivada</span>
                        </div>
                    </div>

                    <div className="navbar-menu">
                        {navItems.map((item) => (
                            <div
                                key={item.path}
                                className={`nav-link${isActive(item.path) ? ' active' : ''}`}
                                onClick={() => handleNav(item.path)}
                            >
                                {item.label}
                            </div>
                        ))}
                        <div className="nav-admit-btn" onClick={() => handleNav('/admin-login')}>
                            Admin Login
                        </div>
                    </div>

                    <button
                        type="button"
                        className="navbar-hamburger"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
                    >
                        {mobileOpen ? <X size={22} color="#ffffff" /> : <Menu size={22} color="#ffffff" />}
                    </button>
                </div>

                <div className={`mobile-menu${mobileOpen ? ' open' : ''}`}>
                    {navItems.map((item) => (
                        <div
                            key={item.path}
                            className="mobile-nav-link"
                            onClick={() => handleNav(item.path)}
                        >
                            {item.label}
                        </div>
                    ))}
                    <div className="mobile-admit-btn" onClick={() => handleNav('/admissions')}>
                        Apply for Admission
                    </div>
                </div>
            </div>
        </nav>
    );
}
