import { useNavigate } from 'react-router-dom';
import { GraduationCap, MapPin, Phone, Mail, Facebook, Youtube, Instagram, Twitter, ChevronRight } from 'lucide-react';

const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Academics', path: '/academics' },
    { label: 'Admissions', path: '/admissions' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Contact Us', path: '/contact' },
];

export default function Footer() {
    const navigate = useNavigate();

    const go = (path) => {
        navigate(path);
        window.scrollTo(0, 0);
    };

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    {/* Brand */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                            <div style={{
                                width: 40, height: 40, background: 'rgba(255,255,255,0.15)',
                                borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <GraduationCap color="#fff" size={22} />
                            </div>
                            <div style={{
                                fontFamily: '"Black Ops One", cursive',
                                fontSize: '22px',
                                fontWeight: 400,
                                letterSpacing: '1px',
                                color: 'white',
                                textTransform: 'uppercase',
                                lineHeight: 1.1,
                            }}>VIDYAVIKAS</div>
                        </div>
                        <div className="footer-brand-tag">[E.M] Blooms, Primary &amp; High School – Gudivada</div>
                        <p className="footer-desc">
                            Committed to nurturing young minds with academic excellence, character building,
                            and holistic development in a safe and inspiring environment.
                        </p>
                        <div className="social-links">
                            <div className="social-icon" title="Facebook"><Facebook size={16} /></div>
                            <div className="social-icon" title="YouTube"><Youtube size={16} /></div>
                            <div className="social-icon" title="Instagram"><Instagram size={16} /></div>
                            <div className="social-icon" title="Twitter"><Twitter size={16} /></div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <div className="footer-heading">Quick Links</div>
                        <div className="footer-links">
                            {quickLinks.map((link) => (
                                <div key={link.path} className="footer-link" onClick={() => go(link.path)}>
                                    <ChevronRight size={14} />
                                    {link.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <div className="footer-heading">Contact Us</div>
                        <p className="footer-contact-item" style={{ display: 'flex', gap: 8 }}>
                            <MapPin size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                            Teacher Colony,<br />Satyanarayana Puram, Gudivada – 521301<br />Andhra Pradesh, India
                        </p>
                        <p className="footer-contact-item" style={{ display: 'flex', gap: 8 }}>
                            <Phone size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                            +91 7386640005<br />+91 8142712666
                        </p>
                        <p className="footer-contact-item" style={{ display: 'flex', gap: 8 }}>
                            <Mail size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                            vidyavikas@gmail.com
                        </p>
                        <p className="footer-contact-item" style={{ marginTop: 4, fontSize: 12 }}>
                            🕐 Mon–Sat: 8:00 AM – 4:00 PM<br />Office: 9:00 AM – 5:00 PM
                        </p>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="footer-copy">
                        © 2025 Vidya Vikas Blooms School, Gudivada. All rights reserved. | Designed with ❤️ for educational excellence.
                    </p>
                    <div className="demo-watermark">⚠ Demo Version</div>
                </div>
            </div>
        </footer>
    );
}
