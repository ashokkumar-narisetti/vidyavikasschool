import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const programmes = [
    {
        icon: '🌱', color: '#e8f7ef', title: 'Pre-Primary', sub: 'Ages 3–5 | Nursery, LKG, UKG',
        desc: 'Our play-based early childhood programme focuses on social-emotional learning, language development, and building foundational numeracy skills through structured play and creative exploration.',
        subjects: ['Language & Communication', 'Early Mathematics', 'Environmental Awareness', 'Arts & Crafts', 'Music & Movement', 'Personal & Social Development'],
    },
    {
        icon: '📚', color: '#e8f2fb', title: 'Primary School', sub: 'Classes 1–5 | Ages 6–10',
        desc: 'The primary curriculum provides a strong academic foundation while encouraging curiosity and creativity. We combine structured learning with hands-on activities, projects, and group work.',
        subjects: ['English Language & Literature', 'Hindi / Telugu', 'Mathematics', 'Environmental Science', 'General Knowledge', 'Computer Basics', 'Arts & Physical Education'],
    },
    {
        icon: '🎓', color: '#fef3e2', title: 'High School', sub: 'Classes 6–10 | Ages 11–16',
        desc: 'Comprehensive CBSE curriculum with specialized coaching for board examinations. Students receive guidance for competitive exams (NTSE, Olympiads) and career counselling from Class 9.',
        subjects: ['English', 'Mathematics', 'Science (Physics, Chemistry, Biology)', 'Social Studies', 'Hindi / Telugu / Sanskrit', 'Computer Science', 'Physical & Health Education'],
    },
];

const methodology = [
    { icon: '🖥️', title: 'Smart Classroom Learning', desc: 'Interactive digital boards and multimedia content make complex concepts visual and engaging for all learning styles.' },
    { icon: '🧪', title: 'Experiential Learning', desc: 'Hands-on experiments, field visits, and project-based assignments ensure concepts are understood and retained.' },
    { icon: '🤝', title: 'Collaborative Approach', desc: 'Group activities, debates, and team projects build communication, leadership, and interpersonal skills.' },
    { icon: '📊', title: 'Continuous Assessment', desc: 'Regular formative assessments identify learning gaps early, allowing timely support and personalized attention.' },
    { icon: '🌐', title: 'Global Perspective', desc: 'Curriculum integrates global topics, events, and intercultural awareness to prepare world-ready citizens.' },
    { icon: '🎯', title: 'Personalized Mentoring', desc: 'Every student is assigned a faculty mentor who tracks their academic progress and provides individual guidance.' },
];

const cocurricular = [
    '🎭 Theatre & Drama', '🎨 Visual Arts', '🎵 Music (Vocal & Instrumental)',
    '💃 Classical & Folk Dance', '⚽ Football', '🏏 Cricket',
    '🏐 Volleyball', '🏃 Athletics & Track', '♟️ Chess Club',
    '🔬 Science Club', '📰 Debate & Public Speaking', '🌿 Eco Club & Nature Studies',
];

export default function Academics() {
    const navigate = useNavigate();

    return (
        <div className="page-wrapper">
            <section className="page-hero">
                <div className="container">
                    <div className="page-hero-content">
                        <div className="page-hero-label">Academics</div>
                        <h1 className="page-hero-title">Our Educational Programmes</h1>
                        <p className="page-hero-sub">Comprehensive CBSE curriculum designed for 21st-century learners.</p>
                        {/* <div className="breadcrumb">
                            <span onClick={() => { navigate('/'); window.scrollTo(0, 0); }} style={{ cursor: 'pointer' }}>Home</span>
                            <span className="breadcrumb-sep">›</span>
                            <span className="breadcrumb-active">Academics</span>
                        </div> */}
                    </div>
                </div>
            </section>

            {/* Programmes */}
            <section className="section">
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: 48 }}>
                        <div className="section-label">Programmes</div>
                        <h2 className="section-title">Curriculum & Programmes</h2>
                        <p className="section-subtitle" style={{ margin: '0 auto' }}>
                            CBSE-affiliated curriculum from Pre-Primary through High School — structured for excellence at every stage.
                        </p>
                    </div>
                    {programmes.map((prog, i) => (
                        <div className="content-card" key={i} style={{ marginBottom: 28 }}>
                            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                <div style={{
                                    width: 72, height: 72, borderRadius: 16,
                                    background: prog.color, fontSize: 32,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0
                                }}>{prog.icon}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                                        <h3 style={{ border: 'none', padding: 0, margin: 0, fontSize: 22 }}>{prog.title}</h3>
                                        <span style={{
                                            background: 'var(--accent-light)', color: 'var(--accent)',
                                            padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600
                                        }}>{prog.sub}</span>
                                    </div>
                                    <p style={{ color: 'var(--text-mid)', fontSize: 15, lineHeight: 1.8, marginBottom: 16 }}>{prog.desc}</p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                        {prog.subjects.map((s, j) => (
                                            <span key={j} style={{
                                                background: 'var(--bg)', border: '1px solid var(--border)',
                                                padding: '5px 12px', borderRadius: 6, fontSize: 13, color: 'var(--text-mid)'
                                            }}>{s}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Teaching Methodology */}
            <section className="section section-bg">
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: 48 }}>
                        <div className="section-label">Methodology</div>
                        <h2 className="section-title">Our Teaching Approach</h2>
                        <p className="section-subtitle" style={{ margin: '0 auto' }}>
                            We go beyond textbooks to create meaningful, memorable, and transformative learning experiences.
                        </p>
                    </div>
                    <div className="academics-grid">
                        {methodology.map((m, i) => (
                            <div className="academic-card" key={i}>
                                <div className="academic-icon blue" style={{ fontSize: 28 }}>{m.icon}</div>
                                <h3 className="academic-title">{m.title}</h3>
                                <p className="academic-desc">{m.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Co-Curricular */}
            <section className="section">
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: 48 }}>
                        <div className="section-label">Beyond Academics</div>
                        <h2 className="section-title">Co-Curricular Activities</h2>
                        <p className="section-subtitle" style={{ margin: '0 auto' }}>
                            We believe in the wholesome development of every student through sports, arts, and clubs.
                        </p>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', marginBottom: 48 }}>
                        {cocurricular.map((item, i) => (
                            <div key={i} style={{
                                background: 'var(--white)', border: '1px solid var(--border)',
                                padding: '14px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600,
                                color: 'var(--primary)', cursor: 'default', transition: 'var(--transition)',
                                boxShadow: '0 2px 8px rgba(31,60,136,0.05)'
                            }}>
                                {item}
                            </div>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <button className="btn btn-primary" onClick={() => { navigate('/admissions'); window.scrollTo(0, 0); }}>
                            Apply for Admission <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
