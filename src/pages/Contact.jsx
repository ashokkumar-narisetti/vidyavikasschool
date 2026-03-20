import { useState } from 'react';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { supabase } from '../lib/supabase';

const SCHOOL_ADDRESS_LINE_1 = 'Teachers Colony, Satyanarayanapuram,';
const SCHOOL_ADDRESS_LINE_2 = 'Gudivada, Andhra Pradesh,521301,India';
const SCHOOL_MAP_URL = 'https://www.google.com/maps/search/?api=1&query=Vidya+Vikas+School+Gudivada+Andhra+Pradesh';
const SCHOOL_MAP_EMBED_URL = 'https://www.google.com/maps?q=Vidya+Vikas+School+Gudivada+Andhra+Pradesh&z=16&output=embed';

const SUBJECT_OPTIONS = [
    'Admission Enquiry',
    'Fee Related Query',
    'Academics Information',
    'Events and Activities',
    'Feedback / Suggestions',
    'Other',
];

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

const emptyForm = {
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
};

const normalizePhone = (value) => value.replace(/[^0-9]/g, '');

export default function Contact() {
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');
    const [form, setForm] = useState(emptyForm);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const resetForNewMessage = () => {
        setSubmitted(false);
        setFormError('');
        setForm(emptyForm);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        const fullName = form.name.trim();
        const phone = form.phone.trim();
        const email = form.email.trim().toLowerCase();
        const subject = form.subject.trim();
        const message = form.message.trim();

        if (!fullName || !phone || !email || !subject || !message) {
            setFormError('Please fill in all required fields.');
            return;
        }

        const digits = normalizePhone(phone);
        if (digits.length < 10) {
            setFormError('Please enter a valid phone number.');
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setFormError('Please enter a valid email address.');
            return;
        }

        setSubmitting(true);
        const { error } = await supabase
            .from('contact_messages')
            .insert({
                name: fullName,
                phone,
                email,
                subject,
                message,
            });
        setSubmitting(false);

        if (error) {
            setFormError('Failed to send your message. Please try again or contact the school office directly.');
            return;
        }

        setForm(emptyForm);
        setSubmitted(true);
    };

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

                            <a
                                className="map-placeholder"
                                style={{ marginTop: 32 }}
                                href={SCHOOL_MAP_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Open map for Vidya Vikas School, Gudivada"
                            >
                                <iframe
                                    title="Vidya Vikas School location map preview"
                                    src={SCHOOL_MAP_EMBED_URL}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                                <span className="map-open-chip">Open in Maps</span>
                            </a>
                            <div className="map-caption" style={{ marginTop: 12 }}>
                                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--primary)' }}>Vidya Vikas School</div>
                                <div style={{ fontSize: 13, color: 'var(--text-light)' }}>
                                    {SCHOOL_ADDRESS_LINE_1} {SCHOOL_ADDRESS_LINE_2}
                                </div>
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
                                            Thank you for contacting us. The admin team can now view your message in the dashboard.
                                        </p>
                                        <button
                                            type="button"
                                            className="form-submit"
                                            style={{ marginTop: 20 }}
                                            onClick={resetForNewMessage}
                                        >
                                            Send Another Message
                                        </button>
                                    </div>
                                ) : (
                                    <form className="contact-full-form" onSubmit={handleSubmit} noValidate>
                                        {formError && (
                                            <div style={{
                                                background: '#fef2f2',
                                                border: '1px solid #fecaca',
                                                color: '#dc2626',
                                                padding: '10px 14px',
                                                borderRadius: 8,
                                                fontSize: 14,
                                            }}>
                                                {formError}
                                            </div>
                                        )}

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Your Name *</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    placeholder="Full Name"
                                                    value={form.name}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Phone Number *</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    placeholder="+91 XXXXX XXXXX"
                                                    value={form.phone}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Email Address *</label>
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="your@email.com"
                                                value={form.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Subject *</label>
                                            <select
                                                name="subject"
                                                value={form.subject}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select subject</option>
                                                {SUBJECT_OPTIONS.map((option) => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Your Message *</label>
                                            <textarea
                                                rows={5}
                                                name="message"
                                                placeholder="Please describe your query in detail..."
                                                value={form.message}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <button className="form-submit" type="submit" disabled={submitting}>
                                            {submitting ? 'Sending...' : 'Send Message'}
                                        </button>
                                    </form>
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
