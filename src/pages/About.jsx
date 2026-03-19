import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowRight } from 'lucide-react';

const BuildingSVG = () => (
    <svg viewBox="0 0 500 380" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        <rect width="500" height="380" fill="url(#skyGrad2)" />
        <defs>
            <linearGradient id="skyGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#87CEEB" />
                <stop offset="100%" stopColor="#c8e6f5" />
            </linearGradient>
        </defs>
        <rect x="0" y="300" width="500" height="80" fill="#5a8a3c" />
        <rect x="0" y="290" width="500" height="20" fill="#6ab04c" />
        <rect x="60" y="120" width="380" height="180" fill="white" stroke="#e0e8ff" strokeWidth="2" />
        <polygon points="40,120 250,50 460,120" fill="#1F3C88" />
        <polygon points="60,120 250,62 440,120" fill="#2a5aad" />
        <rect x="247" y="30" width="3" height="35" fill="#888" />
        <polygon points="250,30 278,38 250,46" fill="#FF6600" />
        {[90, 150, 210, 290, 350, 410].map((x, i) => (
            <rect key={i} x={x} y="145" width="45" height="55" rx="3" fill="#e8f2fb" stroke="#cce4ff" strokeWidth="1.5" />
        ))}
        {[90, 150, 210, 290, 350, 410].map((x, i) => (
            <rect key={i} x={x} y="220" width="45" height="45" rx="3" fill="#e8f2fb" stroke="#cce4ff" strokeWidth="1.5" />
        ))}
        <rect x="210" y="245" width="80" height="55" rx="4" fill="#1F3C88" />
        <rect x="130" y="80" width="240" height="32" rx="4" fill="#F4A400" />
        <text x="250" y="101" textAnchor="middle" fill="white" fontWeight="bold" fontSize="13" fontFamily="sans-serif">VIDYA VIKAS SCHOOL</text>
        <circle cx="30" cy="295" r="28" fill="#2ecc71" />
        <rect x="27" y="300" width="6" height="30" fill="#8B4513" />
        <circle cx="455" cy="290" r="28" fill="#27ae60" />
        <rect x="452" y="295" width="6" height="30" fill="#8B4513" />
    </svg>
);

const infra = [
    { icon: '🏛️', label: 'Smart Classrooms', desc: '50+ tech-enabled classrooms with interactive boards' },
    { icon: '🔬', label: 'Science Labs', desc: 'Physics, Chemistry, and Biology fully-equipped labs' },
    { icon: '💻', label: 'Computer Lab', desc: '60-seat computer lab with high-speed internet' },
    { icon: '📚', label: 'Library', desc: '10,000+ books, periodicals, and digital resources' },
    { icon: '⚽', label: 'Sports Ground', desc: 'Multi-sport ground with cricket, football, and athletics' },
    { icon: '🎨', label: 'Art & Music Room', desc: 'Dedicated spaces for visual arts, music, and dance' },
];

export default function About() {
    const navigate = useNavigate();

    return (
        <div className="page-wrapper">
            {/* Page Hero */}
            <section className="page-hero">
                <div className="container">
                    <div className="page-hero-content">
                        <div className="page-hero-label">About Vidya Vikas School</div>
                        <h1 className="page-hero-title">Our Story, Vision & Mission</h1>
                        <p className="page-hero-sub">34+ years of nurturing excellence, building character, and shaping futures.</p>
                        {/* <div className="breadcrumb">
                            <span onClick={() => { navigate('/'); window.scrollTo(0, 0); }} style={{ cursor: 'pointer' }}>Home</span>
                            <span className="breadcrumb-sep">›</span>
                            <span className="breadcrumb-active">About Us</span>
                        </div> */}
                    </div>
                </div>
            </section>

            {/* History */}
            <section className="section">
                <div className="container">
                    <div className="about-grid">
                        <div className="about-image-wrap">
                            <div className="about-img-main" style={{
                                background: '#f5ede0',
                                height: 'auto',
                                minHeight: 0,
                                padding: 0,
                                overflow: 'hidden',
                                display: 'block',
                                borderRadius: 'var(--radius-lg)',
                            }}>
                                <img
                                    src="/vidyavikas-school.jpeg"
                                    alt="Vidya Vikas School Building"
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        display: 'block',
                                        objectFit: 'contain',
                                    }}
                                />
                            </div>
                            <div className="about-badge">
                                <span className="about-badge-num">Est.</span>
                                <span className="about-badge-text">Year 1992</span>
                            </div>
                        </div>
                        <div className="about-content">
                            <div>
                                <div className="section-label">Our History</div>
                                <h2 className="section-title">Two Decades of Educational Legacy</h2>
                            </div>
                            <p className="about-text">
                                Vidya Vikas School was founded in the year 1992 with a singular vision: to create an educational institution that would transform lives through the power of quality education. Starting with just 150 students and 12 dedicated faculty members, the school has grown into one of the most respected educational institutions in the region.
                            </p>
                            <p className="about-text">
                                Over the past 34 years, we have maintained an unwavering commitment to academic excellence while continuously adapting our methods to meet the evolving needs of 21st-century learners. Our CBSE affiliation ensures our students are prepared for national-level standards and competitive examinations.
                            </p>
                            <p className="about-text">
                                Today, with over 2000 students, 50+ faculty members, and world-class infrastructure, Vidya Vikas School stands as a beacon of educational excellence — a trusted partner for thousands of families in their journey of providing the best education for their children.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision & Mission */}
            <section className="section section-bg">
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: 48 }}>
                        <div className="section-label">Our Purpose</div>
                        <h2 className="section-title">Vision & Mission</h2>
                    </div>
                    <div className="two-col-section" style={{ marginTop: 0 }}>
                        <div className="info-highlight">
                            <h4>🔭 Our Vision</h4>
                            <p>To be a premier institution nationally recognized for inspiring every learner to achieve academic brilliance, moral integrity, and social responsibility — creating future leaders who contribute positively to society and the nation.</p>
                        </div>
                        <div className="info-highlight" style={{ borderColor: 'var(--accent)' }}>
                            <h4>🎯 Our Mission</h4>
                            <p>To provide transformative, world-class education through innovative teaching methodologies, compassionate mentoring, experiential learning, and a stimulating environment that unlocks each child's unique intellectual, creative, and moral potential.</p>
                        </div>
                    </div>
                    <div className="two-col-section">
                        <div className="content-card">
                            <h3>Our Core Values</h3>
                            <ul>
                                <li>Excellence in all academic and extracurricular pursuits</li>
                                <li>Integrity and ethical conduct in every action</li>
                                <li>Respect for diversity and inclusivity</li>
                                <li>Compassion towards fellow community members</li>
                                <li>Innovation and creative thinking</li>
                                <li>National pride and global citizenship</li>
                            </ul>
                        </div>
                        <div className="content-card">
                            <h3>Our Approach</h3>
                            <ul>
                                <li>Student-centered, activity-based learning</li>
                                <li>Continuous and comprehensive assessment</li>
                                <li>Integration of technology in education</li>
                                <li>Focus on mental health and well-being</li>
                                <li>Strong parent-school partnership</li>
                                <li>Community service and social awareness</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Principal's Message */}
            <section className="section">
                <div className="container" style={{ maxWidth: 860 }}>
                    <div style={{ textAlign: 'center', marginBottom: 40 }}>
                        <div className="section-label">Leadership</div>
                        <h2 className="section-title">Principal's Message</h2>
                    </div>
                    <div className="content-card" style={{ position: 'relative', borderTop: '4px solid var(--primary)' }}>
                        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
                            <div style={{ flexShrink: 0, textAlign: 'center' }}>
                                <div style={{
                                    width: 100, height: 100, borderRadius: '50%',
                                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 40, marginBottom: 12, margin: '0 auto 12px'
                                }}>👨‍💼</div>
                                <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 15 }}>Muppalla Subbarao (MSR)</div>
                                <div style={{ fontSize: 13, color: 'var(--text-light)' }}>Principal & Director</div>
                                {/* <div style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 4 }}>M.Ed., Ph.D. (Education)</div> */}
                            </div>
                            <div>
                                <p className="about-text" style={{ marginBottom: 16 }}>
                                    "Dear Parents and Students, welcome to Vidya Vikas School — a place where dreams take shape and potential is transformed into achievement. For over two decades, we have remained steadfast in our commitment to providing an education that goes beyond textbooks.
                                </p>
                                <p className="about-text" style={{ marginBottom: 16 }}>
                                    We believe that every child is unique, gifted in their own way, and deserves an environment that celebrates their individuality while nurturing their strengths. Our dedicated team of educators works tirelessly to ensure that each student receives personalized attention and the opportunity to excel.
                                </p>
                                <p className="about-text">
                                    As you embark on this educational journey with us, I assure you of our unwavering dedication to your child's holistic development — academically, morally, and socially. Together, let us build a brighter future."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Infrastructure */}
            <section className="section section-bg">
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: 48 }}>
                        <div className="section-label">Campus</div>
                        <h2 className="section-title">World-Class Infrastructure</h2>
                        <p className="section-subtitle" style={{ margin: '0 auto' }}>
                            Our state-of-the-art facilities create an optimal environment for learning, discovery, and growth.
                        </p>
                    </div>
                    <div className="academics-grid">
                        {infra.map((item, i) => (
                            <div className="academic-card" key={i}>
                                <div className="academic-icon blue" style={{ fontSize: 28 }}>{item.icon}</div>
                                <h3 className="academic-title">{item.label}</h3>
                                <p className="academic-desc">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
