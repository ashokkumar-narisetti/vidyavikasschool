import { useNavigate } from 'react-router-dom';
import {
    ArrowRight, Layers3, BookOpenCheck, MonitorSmartphone, FlaskConical,
    UserRoundSearch, Laptop, ClipboardCheck, CalendarRange, FileText,
    Medal, RefreshCw, Target, LibraryBig
} from 'lucide-react';

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

const coCurricularImageFiles = [
    '/academic-sports.png',
    '/academic-chess.png',
    '/academic-abacus.png',
    '/academic-dance.png',
    '/academic-lab.png',
    '/academic-computerlab.png',
    '/academic-library.png',
    '/academic-cricket.png',
];

const getActivityNameFromImage = (filePath) => {
    const fileName = filePath.split('/').pop() || '';
    const noExt = fileName.replace(/\.[^/.]+$/, '');
    const withoutPrefix = noExt.replace(/^academic-/, '');
    return withoutPrefix
        .split('-')
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const academicStructure = [
    {
        icon: Layers3,
        title: 'Primary',
        classes: 'LKG - 5',
        desc: 'Strong fundamentals in language, numeracy, environmental awareness, and classroom confidence.',
    },
    {
        icon: BookOpenCheck,
        title: 'Secondary',
        classes: '6 - 10',
        desc: 'Structured subject depth, exam readiness, and guided preparation for board-level performance.',
    },
];

const subjectsByLevel = [
    {
        level: 'Primary (LKG - 5)',
        subjects: ['English', 'Telugu / Hindi', 'Mathematics', 'EVS', 'General Knowledge', 'Computer Basics'],
    },
    {
        level: 'Middle (Classes 6 - 8)',
        subjects: ['English', 'Second Language', 'Mathematics', 'General Science', 'Social Studies', 'Computer Science'],
    },
    {
        level: 'Secondary (Classes 9 - 10)',
        subjects: ['English', 'Mathematics', 'Science', 'Social Studies', 'Second Language', 'IT / Computer Applications'],
    },
];

const teachingMethodologyCards = [
    { icon: MonitorSmartphone, title: 'Smart Classrooms', desc: 'Digital boards and visual aids for concept clarity.' },
    { icon: FlaskConical, title: 'Practical Learning', desc: 'Hands-on activities and real-world examples in class.' },
    { icon: UserRoundSearch, title: 'Individual Attention', desc: 'Close mentoring and differentiated support for each learner.' },
    { icon: Laptop, title: 'Digital Tools', desc: 'Technology-enabled learning resources and assessments.' },
];

const assessmentSystem = [
    { icon: ClipboardCheck, title: 'Weekly Tests', desc: 'Short formative checks for concept reinforcement.' },
    { icon: CalendarRange, title: 'Monthly Exams', desc: 'Scheduled assessments to track topic-wise progress.' },
    { icon: FileText, title: 'Term Exams', desc: 'Comprehensive evaluations across the syllabus.' },
    { icon: BookOpenCheck, title: 'Progress Reports', desc: 'Regular feedback shared with parents and students.' },
];

const specialPrograms = [
    { icon: Medal, title: 'Olympiad Preparation', desc: 'Guided coaching for Math, Science, and language Olympiads.' },
    { icon: RefreshCw, title: 'Remedial Classes', desc: 'Focused support sessions for identified learning gaps.' },
    { icon: Target, title: 'Topper Guidance', desc: 'Advanced mentorship and strategy sessions for high achievers.' },
];

const academicFacilities = [
    { icon: FlaskConical, title: 'Science Lab', desc: 'Practical experiments for Physics, Chemistry, and Biology.' },
    { icon: Laptop, title: 'Computer Lab', desc: 'Modern systems for digital literacy and computer education.' },
    { icon: LibraryBig, title: 'Library', desc: 'Reference books, periodicals, and curated reading spaces.' },
    { icon: MonitorSmartphone, title: 'Smart Classrooms', desc: 'Audio-visual enabled rooms for interactive teaching.' },
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
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                                <div
                                    className="w-14 h-14 sm:w-[72px] sm:h-[72px] rounded-2xl text-2xl sm:text-[32px] flex items-center justify-center flex-shrink-0"
                                    style={{ background: prog.color }}
                                >
                                    {prog.icon}
                                </div>
                                <div className="w-full sm:flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1">
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
                    {/* <!-- UPDATED IMAGE GRID START --> */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6 mb-12">
                        {coCurricularImageFiles.map((imagePath) => {
                            const activityName = getActivityNameFromImage(imagePath);
                            return (
                                <div key={imagePath} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                                    <div className="overflow-hidden">
                                        <img
                                            src={imagePath}
                                            alt={activityName}
                                            className="w-full h-32 md:h-40 object-cover hover:scale-105 transition"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="p-2 text-center">
                                        <p className="text-sm md:text-base font-medium text-gray-700 break-words">
                                            {activityName}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {/* <!-- UPDATED IMAGE GRID END --> */}
                    {/* <div style={{ textAlign: 'center' }}>
                        <button className="btn btn-primary" onClick={() => { navigate('/admissions'); window.scrollTo(0, 0); }}>
                            Apply for Admission <ArrowRight size={16} />
                        </button>
                    </div> */}
                </div>
            </section>

            {/* <!-- NEW SECTION START --> */}
            <section className="py-10 md:py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                        Academic Structure
                    </h2>
                    <p className="text-sm md:text-base mb-8" style={{ color: 'var(--text-mid)' }}>
                        Our academics are organized into clear stage-based learning groups to ensure age-appropriate progression.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {academicStructure.map((group) => {
                            const Icon = group.icon;
                            return (
                                <div
                                    key={group.title}
                                    className="bg-white border rounded-2xl p-5 md:p-6 shadow-sm"
                                    style={{ borderColor: 'var(--border)' }}
                                >
                                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: 'var(--accent-light)' }}>
                                        <Icon size={20} color="var(--primary)" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-dark)' }}>{group.title}</h3>
                                    <p className="text-sm font-semibold mb-2" style={{ color: 'var(--accent)' }}>Classes: {group.classes}</p>
                                    <p className="text-sm md:text-base" style={{ color: 'var(--text-mid)' }}>{group.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="py-10 md:py-16" style={{ background: 'var(--bg)' }}>
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                        Curriculum Overview
                    </h2>
                    <div className="space-y-4 text-sm md:text-base leading-7" style={{ color: 'var(--text-mid)' }}>
                        <p>
                            Our curriculum is designed around concept-based learning, helping students understand the why behind every topic instead of memorizing isolated facts. This improves long-term retention and confident application in exams and real-life situations.
                        </p>
                        <p>
                            Teachers use activity-based instruction through demonstrations, projects, discussions, and hands-on classroom tasks. Students participate actively, ask questions, and build problem-solving ability as part of the daily learning process.
                        </p>
                        <p>
                            We follow a student-centered approach where teaching pace, support, and reinforcement are adapted to student needs. Through continuous mentoring and timely feedback, each child receives the attention required to progress academically with confidence.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-10 md:py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                        Subjects by Level
                    </h2>
                    <p className="text-sm md:text-base mb-8" style={{ color: 'var(--text-mid)' }}>
                        A balanced and progressive subject framework from foundational to board-level classes.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {subjectsByLevel.map((group) => (
                            <div
                                key={group.level}
                                className="bg-white border rounded-2xl p-5 md:p-6 shadow-sm"
                                style={{ borderColor: 'var(--border)' }}
                            >
                                <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-dark)' }}>{group.level}</h3>
                                <ul className="space-y-2">
                                    {group.subjects.map((subject) => (
                                        <li key={subject} className="text-sm md:text-base flex items-start gap-2" style={{ color: 'var(--text-mid)' }}>
                                            <span style={{ color: 'var(--accent)' }}>•</span>
                                            <span>{subject}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-10 md:py-16" style={{ background: 'var(--bg)' }}>
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                        Teaching Methodology
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {teachingMethodologyCards.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={item.title}
                                    className="bg-white border rounded-2xl p-5 shadow-sm"
                                    style={{ borderColor: 'var(--border)' }}
                                >
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: 'var(--accent-light)' }}>
                                        <Icon size={18} color="var(--primary)" />
                                    </div>
                                    <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>{item.title}</h3>
                                    <p className="text-sm leading-6" style={{ color: 'var(--text-mid)' }}>{item.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="py-10 md:py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                        Assessment System
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {assessmentSystem.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={item.title}
                                    className="bg-white border rounded-2xl p-5 shadow-sm"
                                    style={{ borderColor: 'var(--border)' }}
                                >
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: 'var(--accent-light)' }}>
                                        <Icon size={18} color="var(--primary)" />
                                    </div>
                                    <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>{item.title}</h3>
                                    <p className="text-sm leading-6" style={{ color: 'var(--text-mid)' }}>{item.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="py-10 md:py-16" style={{ background: 'var(--bg)' }}>
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                        Special Academic Programs
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        {specialPrograms.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={item.title}
                                    className="bg-white border rounded-2xl p-5 md:p-6 shadow-sm"
                                    style={{ borderColor: 'var(--border)' }}
                                >
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: 'var(--accent-light)' }}>
                                        <Icon size={18} color="var(--primary)" />
                                    </div>
                                    <h3 className="text-base md:text-lg font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>{item.title}</h3>
                                    <p className="text-sm md:text-base leading-6" style={{ color: 'var(--text-mid)' }}>{item.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="py-10 md:py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                        Academic Facilities
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {academicFacilities.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={item.title}
                                    className="bg-white border rounded-2xl p-5 shadow-sm"
                                    style={{ borderColor: 'var(--border)' }}
                                >
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: 'var(--accent-light)' }}>
                                        <Icon size={18} color="var(--primary)" />
                                    </div>
                                    <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>{item.title}</h3>
                                    <p className="text-sm leading-6" style={{ color: 'var(--text-mid)' }}>{item.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <button className="btn btn-primary" onClick={() => { navigate('/admissions'); window.scrollTo(0, 0); }}>
                            Apply for Admission <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </section>
            {/* <!-- NEW SECTION END --> */}
        </div>
    );
}
