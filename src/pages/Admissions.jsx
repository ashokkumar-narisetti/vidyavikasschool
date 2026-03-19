import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const steps = [
    { num: '01', title: 'Online Enquiry', desc: 'Fill in the admissions enquiry form on our website or visit the school office in person. Our team will contact you within 24 hours with further details.' },
    { num: '02', title: 'Campus Visit & Interaction', desc: "Schedule a visit to tour our world-class campus, meet the faculty, and understand our curriculum and extracurricular programmes at firsthand." },
    { num: '03', title: 'Student Assessment', desc: "A light age-appropriate learning assessment helps us understand your child's current level so we can provide the best support and placement." },
    { num: '04', title: 'Confirmation & Enrolment', desc: "Upon acceptance, complete the admission formalities, submit required documents, and pay the registration fee to confirm your child's seat." },
];

const documents = [
    'Birth Certificate (Original + Photocopy)',
    'Transfer Certificate from previous school (if applicable)',
    'Mark Sheet / Report Card of last academic year',
    'Aadhar Card of Student (Original + Photocopy)',
    'Aadhar Card of Parents / Guardian',
    'Passport-size photographs of student (6 copies)',
    'Residential address proof (Electricity bill / Rental agreement)',
    'Medical fitness certificate from a registered doctor',
    'Caste Certificate (if applicable for reservation)',
];

const feeData = [
    { grade: 'Nursery / LKG / UKG', admission: '₹5,000', tuition: '₹1,200/month', annual: '₹8,000' },
    { grade: 'Classes 1 – 3', admission: '₹6,000', tuition: '₹1,500/month', annual: '₹10,000' },
    { grade: 'Classes 4 – 5', admission: '₹7,000', tuition: '₹1,800/month', annual: '₹12,000' },
    { grade: 'Classes 6 – 8', admission: '₹8,000', tuition: '₹2,200/month', annual: '₹15,000' },
    { grade: 'Classes 9 – 10', admission: '₹10,000', tuition: '₹2,800/month', annual: '₹18,000' },
];

const emptyForm = {
    parent_name: '',
    phone: '',
    student_name: '',
    class_applied: '',
    message: '',
};

export default function Admissions() {
    const navigate = useNavigate();
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!form.parent_name.trim() || !form.phone.trim() || !form.student_name.trim() || !form.class_applied) {
            setFormError('Please fill in all required fields marked with *');
            return;
        }

        setSubmitting(true);
        const { error } = await supabase.from('applications').insert({
            student_name: form.student_name.trim(),
            parent_name: form.parent_name.trim(),
            phone: form.phone.trim(),
            class_applied: form.class_applied,
            message: form.message.trim() || null,
        });
        setSubmitting(false);

        if (error) {
            setFormError('Failed to submit your enquiry. Please try again or call us directly.');
        } else {
            setForm(emptyForm);
            setSubmitted(true);
        }
    };

    return (
        <div className="page-wrapper">
            <section className="page-hero">
                <div className="container">
                    <div className="page-hero-content">
                        <div className="page-hero-label">Admissions 2025–26</div>
                        <h1 className="page-hero-title">Join the Vidya Vikas Family</h1>
                        <p className="page-hero-sub">Admissions are open for the academic year 2025–26. Seats are limited — enquire today.</p>
                    </div>
                </div>
            </section>

            {/* Admission Process */}
            <section className="section">
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: 48 }}>
                        <div className="section-label">How to Apply</div>
                        <h2 className="section-title">Simple 4-Step Admission Process</h2>
                    </div>
                    <div style={{ maxWidth: 700, margin: '0 auto' }}>
                        <div className="process-timeline">
                            {steps.map((step, i) => (
                                <div className="process-step" key={i}>
                                    <div className="process-num">{step.num}</div>
                                    <div className="process-content">
                                        <h4>{step.title}</h4>
                                        <p>{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Fee Structure */}
            <section className="section section-bg">
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: 40 }}>
                        <div className="section-label">Fee Structure</div>
                        <h2 className="section-title">Academic Year 2025–26</h2>
                        <p className="section-subtitle" style={{ margin: '0 auto' }}>
                            Transparent fee structure with no hidden charges. Installment options available.
                        </p>
                    </div>
                    <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
                        <div style={{ background: 'var(--accent-light)', padding: '12px 20px', fontSize: 13, color: 'var(--text-mid)', borderBottom: '1px solid var(--border)' }}>
                            ⚠️ <strong>Note:</strong> Placeholder fee structure for demo. Actual fees may vary — contact the school office for confirmed details.
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table className="fee-table">
                                <thead>
                                    <tr>
                                        <th>Grade / Class</th>
                                        <th>Admission Fee (One-time)</th>
                                        <th>Tuition Fee</th>
                                        <th>Annual Charges</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {feeData.map((row, i) => (
                                        <tr key={i}>
                                            <td><strong>{row.grade}</strong></td>
                                            <td>{row.admission}</td>
                                            <td>{row.tuition}</td>
                                            <td>{row.annual}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div style={{ marginTop: 24, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                        <div className="info-highlight" style={{ flex: 1, minWidth: 240 }}>
                            <h4>💡 Scholarships Available</h4>
                            <p>Merit-based scholarships of up to 50% fee waiver are available for academically outstanding students. Sports and arts scholarships are also offered.</p>
                        </div>
                        <div className="info-highlight" style={{ flex: 1, minWidth: 240, borderColor: 'var(--accent)' }}>
                            <h4>🏦 Payment Options</h4>
                            <p>Fees can be paid in quarterly installments. Online payment via UPI, NEFT/RTGS available. Contact office for ECS/auto-debit setup.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Required Documents */}
            <section className="section">
                <div className="container">
                    <div style={{ maxWidth: 820, margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: 40 }}>
                            <div className="section-label">Checklist</div>
                            <h2 className="section-title">Required Documents</h2>
                        </div>
                        <div className="content-card">
                            <h3>Documents to Submit at Time of Admission</h3>
                            <ul>
                                {documents.map((doc, i) => <li key={i}>{doc}</li>)}
                            </ul>
                            <div style={{ marginTop: 24, background: 'var(--accent-light)', borderRadius: 10, padding: 16, fontSize: 14, color: 'var(--primary)', display: 'flex', gap: 10 }}>
                                <span>📌</span>
                                <span>All originals verified and returned. For queries, call: <strong>+91 98765 43210</strong></span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Enquiry Form */}
            <section className="admissions-section" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #2a5aad 100%)' }}>
                <div className="container">
                    <div style={{ maxWidth: 680, margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: 40 }}>
                            <div className="section-label" style={{ color: 'rgba(255,255,255,0.7)' }}>Get In Touch</div>
                            <h2 className="section-title" style={{ color: 'white' }}>Enquire Now</h2>
                            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15 }}>
                                Fill in the form and our admissions counsellor will call you within 24 hours.
                            </p>
                        </div>

                        {submitted ? (
                            <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '48px 36px', textAlign: 'center' }}>
                                <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
                                <h3 style={{ color: 'var(--primary)', marginBottom: 8 }}>Enquiry Submitted Successfully!</h3>
                                <p style={{ color: 'var(--text-mid)', lineHeight: 1.8 }}>
                                    Thank you for your interest in Vidya Vikas School. Our admissions team will contact you within 24 hours.
                                </p>
                                <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => setSubmitted(false)}>
                                    Submit Another Enquiry
                                </button>
                            </div>
                        ) : (
                            <form className="admission-form" onSubmit={handleSubmit} noValidate>
                                <div className="form-title">Admission Enquiry Form</div>
                                <p className="form-subtitle">Academic Year 2025–26 | Fields marked * are required</p>

                                {formError && (
                                    <div style={{
                                        background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626',
                                        padding: '10px 16px', borderRadius: 8, fontSize: 14, marginBottom: 16,
                                    }}>
                                        ⚠️ {formError}
                                    </div>
                                )}

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Parent / Guardian Name *</label>
                                        <input
                                            type="text"
                                            name="parent_name"
                                            placeholder="Full Name"
                                            value={form.parent_name}
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
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Student's Name *</label>
                                        <input
                                            type="text"
                                            name="student_name"
                                            placeholder="Student's Full Name"
                                            value={form.student_name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Applying for Grade *</label>
                                        <select
                                            name="class_applied"
                                            value={form.class_applied}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Grade</option>
                                            <option>Nursery</option>
                                            <option>LKG</option>
                                            <option>UKG</option>
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(g => <option key={g}>Class {g}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Message or Specific Query</label>
                                    <textarea
                                        rows={3}
                                        name="message"
                                        placeholder="Share any specific requirements or questions..."
                                        value={form.message}
                                        onChange={handleChange}
                                    />
                                </div>
                                <button type="submit" className="form-submit" disabled={submitting}>
                                    {submitting ? 'Submitting...' : 'Submit Enquiry 🎓'}
                                </button>
                                <p style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 12, textAlign: 'center' }}>
                                    📞 Prefer to call? <strong>+91 98765 43210</strong> (Mon–Sat, 9 AM – 5 PM)
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
