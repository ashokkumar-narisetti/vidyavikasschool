import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';

const SCHOOL_ADDRESS_LINE_1 = 'Teachers Colony, Satyanarayanapuram,';
const SCHOOL_ADDRESS_LINE_2 = 'Gudivada, Andhra Pradesh,521301,India';
const SCHOOL_MAP_URL = 'https://www.google.com/maps/search/?api=1&query=Vidya+Vikas+School+Gudivada+Andhra+Pradesh';

const contactInfo = [
    {
        icon: <MapPin size={20} />,
        title: 'School Address',
        lines: [SCHOOL_ADDRESS_LINE_1, SCHOOL_ADDRESS_LINE_2],
    },
    {
        icon: <Phone size={20} />,
        title: 'Phone Numbers',
        lines: ['+91 7386640005 (Admissions Helpline)', '+91 8142712666 (Main Office)'],
    },
    {
        icon: <Mail size={20} />,
        title: 'Email Address',
        lines: ['vidyavikas@gmail.com'],
    },
    {
        icon: <Clock size={20} />,
        title: 'Timings',
        lines: ['School: 8:00 AM - 2:30 PM (Mon-Sat)', 'Office: 9:00 AM - 5:00 PM (Mon-Sat)'],
    },
];

export default function Contact() {
    const navigate = useNavigate();
    const [submitted, setSubmitted] = useState(false);

    return (
        <div className="page-wrapper">
            <section className="page-hero">
                <div className="container">
                    <div className="page-hero-content">
                        <div className="page-hero-label">Get In Touch</div>
                        <h1 className="page-hero-title">Contact Vidya Vikas School</h1>
                        <p className="page-hero-sub">We are always happy to hear from parents, students, and the community.</p>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="contact-grid">
                        <div>
                            <div className="section-label">Contact Details</div>
                            <h2 className="section-title">Reach Us Anytime</h2>

                            <div className="contact-info">
                                {contactInfo.map((item, i) => (
                                    <div className="contact-item" key={i}>
                                        <div className="contact-icon">{item.icon}</div>
                                        <div className="contact-detail">
                                            <h4>{item.title}</h4>
                                            {item.lines.map((line, j) => (
                                                <p key={j} style={{ marginBottom: 0, lineHeight: 1.7 }}>{line}</p>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="map-placeholder" style={{ marginTop: 32 }}>
                                <div className="map-icon">Map</div>
                                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--primary)' }}>Vidya Vikas School</div>
                                <div style={{ fontSize: 13, color: 'var(--text-light)', textAlign: 'center', padding: '0 24px' }}>
                                    {SCHOOL_ADDRESS_LINE_1}<br />{SCHOOL_ADDRESS_LINE_2}
                                </div>
                                <a
                                    href={SCHOOL_MAP_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        background: 'var(--primary)', color: 'white', padding: '10px 20px',
                                        borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                                        textDecoration: 'none', marginTop: 8
                                    }}
                                >
                                    Open in Google Maps
                                </a>
                            </div>
                        </div>

                        <div>
                            <div className="section-label">Send a Message</div>
                            <h2 className="section-title">How Can We Help You?</h2>
                            <div style={{ marginTop: 24 }}>
                                {submitted ? (
                                    <div style={{
                                        background: 'var(--accent-light)', borderRadius: 'var(--radius-lg)',
                                        padding: '48px 36px', textAlign: 'center', border: '2px solid var(--accent)'
                                    }}>
                                        <div style={{ fontSize: 48, marginBottom: 16 }}>Done</div>
                                        <h3 style={{ color: 'var(--primary)', marginBottom: 8 }}>Message Sent Successfully!</h3>
                                        <p style={{ color: 'var(--text-mid)', lineHeight: 1.8 }}>
                                            Thank you for contacting us. Our team will respond to your message within 1-2 business days.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="contact-full-form">
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Your Name *</label>
                                                <input type="text" placeholder="Full Name" />
                                            </div>
                                            <div className="form-group">
                                                <label>Phone Number *</label>
                                                <input type="tel" placeholder="+91 XXXXX XXXXX" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Email Address *</label>
                                            <input type="email" placeholder="your@email.com" />
                                        </div>
                                        <div className="form-group">
                                            <label>Subject *</label>
                                            <select>
                                                <option value="">Select subject</option>
                                                <option>Admission Enquiry</option>
                                                <option>Fee Related Query</option>
                                                <option>Academics Information</option>
                                                <option>Events and Activities</option>
                                                <option>Feedback / Suggestions</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Your Message *</label>
                                            <textarea rows={5} placeholder="Please describe your query in detail..." />
                                        </div>
                                        <button className="form-submit" onClick={() => setSubmitted(true)}>
                                            Send Message
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section style={{ background: 'var(--primary)', padding: '40px 0' }}>
                <div className="container">
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: 40, flexWrap: 'wrap', textAlign: 'center'
                    }}>
                        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15 }}>
                            Admissions Helpline: <a href="tel:+917386640005" style={{ color: 'white', fontWeight: 700 }}>+91 7386640005</a>
                        </div>
                        <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.3)' }} />
                        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15 }}>
                            Email: <a href="mailto:vidyavikas@gmail.com" style={{ color: 'white', fontWeight: 700 }}>vidyavikas@gmail.com</a>
                        </div>
                        <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.3)' }} />
                        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15 }}>
                            Mon-Sat: <span style={{ color: 'white', fontWeight: 700 }}>9:00 AM - 5:00 PM</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

