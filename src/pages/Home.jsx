import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import HomePopupBannerModal from '../components/HomePopupBannerModal';
import {
    Users, GraduationCap, Trophy, Star, BookOpen, ChevronRight, ArrowRight,
    MapPin, Phone, Mail, Clock, Medal, Microscope, Award, ChevronLeft, X
} from 'lucide-react';

const SCHOOL_ADDRESS_LINE_1 = 'Teachers Colony, Satyanarayanapuram,';
const SCHOOL_ADDRESS_LINE_2 = 'Gudivada, Andhra Pradesh,521301,India';
const SCHOOL_MAP_URL = 'https://www.google.com/maps/search/?api=1&query=Vidya+Vikas+School+Gudivada+Andhra+Pradesh';
const SCHOOL_MAP_EMBED_URL = 'https://www.google.com/maps?q=Vidya+Vikas+School+Gudivada+Andhra+Pradesh&z=16&output=embed';


/* ── SVG Illustrations ── */
const StudentSVG = () => (
    <svg viewBox="0 0 300 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="hero-student-svg">
        {/* Body */}
        <rect x="100" y="200" width="100" height="130" rx="8" fill="#fff" />
        {/* Shirt */}
        <rect x="100" y="200" width="100" height="90" rx="8" fill="#e8f0ff" />
        {/* Tie */}
        <polygon points="148,210 152,210 158,270 148,260 138,270" fill="#1F3C88" />
        {/* Arms */}
        <rect x="60" y="205" width="40" height="25" rx="12" fill="#e8f0ff" />
        <rect x="200" y="205" width="40" height="25" rx="12" fill="#e8f0ff" />
        {/* Thumbs */}
        <circle cx="58" cy="222" r="10" fill="#f5cba7" />
        <circle cx="242" cy="222" r="10" fill="#f5cba7" />
        {/* Head */}
        <circle cx="150" cy="140" r="55" fill="#f5cba7" />
        {/* Hair */}
        <path d="M95 135 Q95 80 150 80 Q205 80 205 135 Q205 100 150 95 Q95 100 95 135 Z" fill="#3d1f00" />
        {/* Eyes */}
        <ellipse cx="132" cy="138" rx="8" ry="9" fill="white" />
        <ellipse cx="168" cy="138" rx="8" ry="9" fill="white" />
        <circle cx="134" cy="140" r="5" fill="#2c1810" />
        <circle cx="170" cy="140" r="5" fill="#2c1810" />
        <circle cx="136" cy="138" r="2" fill="white" />
        <circle cx="172" cy="138" r="2" fill="white" />
        {/* Smile */}
        <path d="M130 162 Q150 178 170 162" stroke="#c0392b" strokeWidth="3" strokeLinecap="round" fill="none" />
        {/* Backpack */}
        <rect x="85" y="215" width="30" height="55" rx="6" fill="#1F3C88" />
        <rect x="90" y="220" width="20" height="10" rx="3" fill="#2a5aad" />
        {/* Legs */}
        <rect x="110" y="320" width="30" height="60" rx="8" fill="#2c3e50" />
        <rect x="160" y="320" width="30" height="60" rx="8" fill="#2c3e50" />
        {/* Shoes */}
        <ellipse cx="125" cy="378" rx="20" ry="10" fill="#1a1a1a" />
        <ellipse cx="175" cy="378" rx="20" ry="10" fill="#1a1a1a" />
    </svg>
);

const BuildingSVG = () => (
    <svg viewBox="0 0 500 380" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        {/* Sky */}
        <rect width="500" height="380" fill="url(#skyGrad)" />
        <defs>
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#87CEEB" />
                <stop offset="100%" stopColor="#c8e6f5" />
            </linearGradient>
        </defs>
        {/* Ground */}
        <rect x="0" y="300" width="500" height="80" fill="#5a8a3c" />
        <rect x="0" y="290" width="500" height="20" fill="#6ab04c" />
        {/* Main building */}
        <rect x="60" y="120" width="380" height="180" fill="white" stroke="#e0e8ff" strokeWidth="2" />
        {/* Roof */}
        <polygon points="40,120 250,50 460,120" fill="#1F3C88" />
        <polygon points="60,120 250,62 440,120" fill="#2a5aad" />
        {/* Flag */}
        <rect x="247" y="30" width="3" height="35" fill="#888" />
        <polygon points="250,30 278,38 250,46" fill="#FF6600" />
        {/* Windows row 1 */}
        {[90, 150, 210, 290, 350, 410].map((x, i) => (
            <rect key={i} x={x} y="145" width="45" height="55" rx="3" fill="#e8f2fb" stroke="#cce4ff" strokeWidth="1.5" />
        ))}
        {/* Windows row 2 */}
        {[90, 150, 210, 290, 350, 410].map((x, i) => (
            <rect key={i} x={x} y="220" width="45" height="45" rx="3" fill="#e8f2fb" stroke="#cce4ff" strokeWidth="1.5" />
        ))}
        {/* Door */}
        <rect x="210" y="245" width="80" height="55" rx="4" fill="#1F3C88" />
        <rect x="217" y="252" width="28" height="44" rx="2" fill="#4A90D9" opacity="0.4" />
        <rect x="255" y="252" width="28" height="44" rx="2" fill="#4A90D9" opacity="0.4" />
        {/* School name board */}
        <rect x="130" y="80" width="240" height="32" rx="4" fill="#F4A400" />
        <text x="250" y="101" textAnchor="middle" fill="white" fontWeight="bold" fontSize="13" fontFamily="sans-serif">VIDYA VIKAS SCHOOL</text>
        {/* Trees */}
        <circle cx="30" cy="295" r="28" fill="#2ecc71" />
        <rect x="27" y="300" width="6" height="30" fill="#8B4513" />
        <circle cx="455" cy="290" r="28" fill="#27ae60" />
        <rect x="452" y="295" width="6" height="30" fill="#8B4513" />
        {/* Path */}
        <polygon points="200,380 300,380 280,300 220,300" fill="#d4c5a0" />
    </svg>
);

/* ── Sections Data ── */
const stats = [
    { icon: <Users size={24} />, number: '2000+', label: 'Students Enrolled' },
    { icon: <GraduationCap size={24} />, number: '150+', label: 'Expert Faculty' },
    { icon: <Trophy size={24} />, number: '100%', label: 'SSC Pass Results' },
    { icon: <Star size={24} />, number: '34+', label: 'Years of Excellence' },
];

const academics = [
    {
        icon: '🌱', iconClass: 'green', title: 'Pre-Primary',
        age: 'Ages 3 – 5 Years',
        desc: 'A nurturing play-based learning environment where curiosity is sparked and foundational skills in language, numeracy, and social development are built through joyful exploration.',
    },
    {
        icon: '📚', iconClass: 'blue', title: 'Primary School',
        age: 'Classes 1 – 5 (Ages 6 – 10)',
        desc: 'Structured academic foundation with emphasis on reading, writing, mathematics, and science. Activity-based learning builds confident learners with strong analytical and creative skills.',
    },
    {
        icon: '🏆', iconClass: 'orange', title: 'High School',
        age: 'Classes 6 – 10 (Ages 11 – 16)',
        desc: 'Rigorous CBSE curriculum with specialized coaching for board examinations. Focus on competitive exam readiness, critical thinking, and career orientation for students.',
    },
];

const achievements = [
    { icon: '🎓', title: '100% Board Results', desc: 'Consistent 100% pass rate in SSC/CBSE board examinations for 10+ consecutive years.' },
    { icon: '🥇', title: 'District Rank Holders', desc: 'Our students secure top district ranks every year, with multiple students in state top-10.' },
    { icon: '🔬', title: 'Olympiad Winners', desc: 'National and state-level winners in Science, Math, and English Olympiads annually.' },
    { icon: '⚽', title: 'Sports Achievements', desc: 'District champions in cricket, volleyball, and kabaddi. State-level athletics representation.' },
];

const testimonials = [
    {
        text: "My daughter's transformation after joining Vidya Vikas School has been remarkable. The teachers are incredibly dedicated, and the school environment fosters both academic excellence and personal growth.",
        name: 'Priya Reddy',
        role: 'Parent of Class 8 Student',
        initial: 'P',
    },
    {
        text: "We are amazed by the quality of education and the extracurricular opportunities available. Our son topped the district in SSC examinations. Best decision we made as parents!",
        name: 'Suresh Kumar',
        role: 'Parent of Class 10 Student',
        initial: 'S',
    },
    {
        text: "The school's focus on holistic development is truly commendable. From sports to arts to academics, every child is given equal attention and opportunity to excel.",
        name: 'Anitha Sharma',
        role: 'Parent of Class 5 Student',
        initial: 'A',
    },
];

const admissionSteps = [
    { num: '01', title: 'Submit Enquiry', desc: 'Fill in the online enquiry form with your child\'s details and preferred grade.' },
    { num: '02', title: 'School Visit', desc: 'Schedule a campus tour and interact with our academic team and faculty.' },
    { num: '03', title: 'Assessment', desc: 'Age-appropriate assessment to understand your child\'s current learning level.' },
    { num: '04', title: 'Enrolment', desc: 'Complete documentation and fee payment to confirm your child\'s admission.' },
];

export default function Home() {
    const navigate = useNavigate();
    const [galleryImages, setGalleryImages] = useState([]);
    const [galleryLoading, setGalleryLoading] = useState(true);
    const [galleryError, setGalleryError] = useState('');
    const [currentSlide, setCurrentSlide] = useState(0);
    const [dismissedImageIds, setDismissedImageIds] = useState([]);

    const go = (path) => {
        navigate(path);
        window.scrollTo(0, 0);
    };

    useEffect(() => {
        const fetchGalleryImages = async () => {
            setGalleryLoading(true);
            const { data, error } = await supabase
                .from('gallery')
                .select('id, image_url, event_title, created_at')
                .order('created_at', { ascending: false });

            if (error) {
                setGalleryError('Unable to load homepage slider images.');
            } else {
                setGalleryImages(data ?? []);
                setGalleryError('');
            }
            setGalleryLoading(false);
        };

        fetchGalleryImages();
    }, []);

    const activeSlides = useMemo(
        () => galleryImages.filter((img) => !dismissedImageIds.includes(img.id)),
        [galleryImages, dismissedImageIds]
    );

    useEffect(() => {
        if (currentSlide >= activeSlides.length) {
            setCurrentSlide(0);
        }
    }, [activeSlides.length, currentSlide]);

    useEffect(() => {
        if (activeSlides.length <= 1) return undefined;
        const timer = window.setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
        }, 4000);
        return () => window.clearInterval(timer);
    }, [activeSlides.length]);

    const goToPrevSlide = () => {
        if (activeSlides.length === 0) return;
        setCurrentSlide((prev) => (prev === 0 ? activeSlides.length - 1 : prev - 1));
    };

    const goToNextSlide = () => {
        if (activeSlides.length === 0) return;
        setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    };

    const dismissSlide = (id) => {
        setDismissedImageIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    };

    return (
        <main>
            <HomePopupBannerModal />
            {/* ── HERO ── */}
            <section className="hero-section">
                <div className="hero-bg-pattern" aria-hidden="true" />
                <div className="container">
                    <div className="hero-inner">
                        {/* Left */}
                        <div className="hero-content">
                            <div className="hero-badge">
                                <GraduationCap size={16} />
                                Admissions Open for 2025–26
                            </div>
                            <h1 className="hero-title">
                                Your Child's<br />
                                <span>Future Begins</span><br />
                                Here
                            </h1>
                            <p className="hero-subtitle">
                                A modern learning environment focused on academic excellence and holistic development — nurturing confident, curious, and compassionate learners since 1992.
                            </p>
                            <div className="hero-cta">
                                <button className="btn btn-primary" onClick={() => go('/admissions')}>
                                    🎓 Apply for Admission
                                </button>
                                <button className="btn btn-outline" onClick={() => go('/academics')}>
                                    Explore Academics <ArrowRight size={16} />
                                </button>
                            </div>
                            <div className="hero-trust">
                                <div className="hero-trust-item">
                                    <span className="hero-trust-dot" /> CBSE Affiliated
                                </div>
                                <div className="hero-trust-item">
                                    <span className="hero-trust-dot" /> NAAC Accredited
                                </div>
                                <div className="hero-trust-item">
                                    <span className="hero-trust-dot" /> ISO Certified
                                </div>
                            </div>
                        </div>

                        {/* Right – Students Photo */}
                        <div className="hero-image-wrap">
                            <div className="hero-image-card" style={{ padding: 0, overflow: 'hidden' }}>
                                <img
                                    src="/school-students.jpg"
                                    alt="Vidya Vikas School Students"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        objectPosition: 'center top',
                                        display: 'block',
                                    }}
                                />
                            </div>
                            <div className="hero-float-card card-1">
                                <div className="float-icon"><Trophy size={18} color="var(--primary)" /></div>
                                <div>
                                    <div style={{ fontSize: 16, fontWeight: 800 }}>100%</div>
                                    <div style={{ fontSize: 11, color: 'var(--text-light)', fontWeight: 400 }}>Board Results</div>
                                </div>
                            </div>
                            <div className="hero-float-card card-2">
                                <div className="float-icon"><Users size={18} color="var(--primary)" /></div>
                                <div>
                                    <div style={{ fontSize: 16, fontWeight: 800 }}>2000+</div>
                                    <div style={{ fontSize: 11, color: 'var(--text-light)', fontWeight: 400 }}>Happy Students</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── STATS BAR ── */}
            <section style={{ background: 'var(--bg)', padding: '0 0 60px' }}>
                <div className="container">
                    <div className="stats-bar">
                        <div className="stats-grid">
                            {stats.map((s, i) => (
                                <div className="stat-item" key={i}>
                                    <div className="stat-icon">{s.icon}</div>
                                    <div className="stat-number">{s.number}</div>
                                    <div className="stat-label">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── TELUGU QUOTE BANNER ── */}
            <div style={{
                background: 'linear-gradient(135deg, #0f0c29 0%, #1F3C88 40%, #302b63 70%, #24243e 100%)',
                padding: '36px 24px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 4px 30px rgba(15,12,41,0.5)',
            }}>
                {/* Decorative glow orbs */}
                <div style={{
                    position: 'absolute', top: '-40px', left: '10%',
                    width: 200, height: 200,
                    background: 'radial-gradient(circle, rgba(255,165,0,0.15) 0%, transparent 70%)',
                    borderRadius: '50%', pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute', bottom: '-40px', right: '10%',
                    width: 200, height: 200,
                    background: 'radial-gradient(circle, rgba(74,144,217,0.2) 0%, transparent 70%)',
                    borderRadius: '50%', pointerEvents: 'none',
                }} />
                {/* Decorative top line */}
                <div style={{
                    width: 60, height: 3,
                    background: 'linear-gradient(90deg, #F4A400, #ff6b35)',
                    borderRadius: 2, margin: '0 auto 18px',
                }} />
                <p style={{
                    margin: 0,
                    fontFamily: "'Poppins', 'Noto Sans Telugu', sans-serif",
                    fontSize: 'clamp(16px, 3vw, 26px)',
                    fontWeight: 800,
                    letterSpacing: '0.5px',
                    lineHeight: 1.6,
                    background: 'linear-gradient(90deg, #F4A400 0%, #FFD700 40%, #FF8C42 70%, #F4A400 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 2px 8px rgba(244,164,0,0.4))',
                }}>
                    సాన పడితే రాయి రత్నం, పదును పెడితే మేధ నిశితం, తీర్చిదిద్దితే ప్రతి బాలుడు ఓ నిష్ణాతుడే.....
                </p>
                {/* Decorative bottom line */}
                <div style={{
                    width: 60, height: 3,
                    background: 'linear-gradient(90deg, #4A90D9, #6ab0ff)',
                    borderRadius: 2, margin: '18px auto 0',
                }} />
            </div>

            {/* ── ABOUT ── */}
            <section className="section">
                <div className="container">
                    <div className="about-grid">
                        {/* Image */}
                        <div className="about-image-wrap animate-left">
                            <div className="about-img-main" style={{
                                padding: 0,
                                overflow: 'hidden',
                                background: '#C9A87C',
                                height: 'auto',
                                minHeight: 320,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <img
                                    src="/school-building.png"
                                    alt="Vidya Vikas School Building"
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        objectFit: 'contain',
                                        display: 'block',
                                    }}
                                />
                            </div>
                            <div className="about-badge">
                                <span className="about-badge-num">34+</span>
                                <span className="about-badge-text">Years of Excellence</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="about-content animate-right">
                            <div>
                                <div className="section-label">About Us</div>
                                <h2 className="section-title">Shaping Young Minds for a Brighter Tomorrow</h2>
                            </div>
                            <p className="about-text">
                                Established in 1992, Vidya Vikas School has been a cornerstone of quality education in the region. Our CBSE-affiliated institution provides a dynamic and inclusive learning environment where every child is encouraged to discover their potential and pursue excellence.
                            </p>
                            <p className="about-text">
                                With state-of-the-art infrastructure, experienced faculty, and a comprehensive curriculum that blends academics with co-curricular activities, we prepare students not just for examinations, but for life itself.
                            </p>
                            <p className="about-text">
                                Our 34+ years of consistent results and the trust of over 2000 families stand as a testament to our unwavering commitment to educational excellence.
                            </p>

                            <div className="vision-mission-box" style={{ borderColor: 'var(--primary)' }}>
                                <div className="vm-title">🔭 Our Vision</div>
                                <p className="vm-text">To be a premier institution that inspires every learner to achieve academic brilliance, moral integrity, and social responsibility.</p>
                            </div>

                            <div className="vision-mission-box" style={{ borderColor: 'var(--accent)' }}>
                                <div className="vm-title">🎯 Our Mission</div>
                                <p className="vm-text">To provide transformative education through innovative teaching, compassionate mentoring, and a stimulating environment that unlocks each child's unique potential.</p>
                            </div>

                            <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={() => go('/about')}>
                                Know More About Us <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── ACADEMICS ── */}
            <section className="section section-bg">
                <div className="container">
                    <div style={{ textAlign: 'center' }}>
                        <div className="section-label">Academics</div>
                        <h2 className="section-title">Our Educational Programmes</h2>
                        <p className="section-subtitle" style={{ margin: '0 auto' }}>
                            Comprehensive education from pre-primary to high school with a curriculum designed to inspire and prepare students for the future.
                        </p>
                    </div>
                    <div className="academics-grid">
                        {academics.map((ac, i) => (
                            <div className="academic-card animate-fade" key={i} style={{ animationDelay: `${i * 0.15}s` }}>
                                <div className={`academic-icon ${ac.iconClass}`}>{ac.icon}</div>
                                <h3 className="academic-title">{ac.title}</h3>
                                <span className="academic-age">{ac.age}</span>
                                <p className="academic-desc">{ac.desc}</p>
                                <div className="academic-link" onClick={() => go('/academics')}>
                                    Learn More <ArrowRight size={14} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── ACHIEVEMENTS ── */}
            <section className="section" id="achievements">
                <div className="container">
                    <div style={{ textAlign: 'center' }}>
                        <div className="section-label">Achievements</div>
                        <h2 className="section-title">A Legacy of Excellence</h2>
                        <p className="section-subtitle" style={{ margin: '0 auto' }}>
                            Our students consistently achieve remarkable results at district, state, and national levels.
                        </p>
                    </div>
                    <div className="achievements-grid">
                        {achievements.map((ach, i) => (
                            <div className="achievement-card" key={i}>
                                <div className="achievement-icon-wrap">{ach.icon}</div>
                                <div className="achievement-title">{ach.title}</div>
                                <p className="achievement-desc">{ach.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── GALLERY PREVIEW ── */}
            <section className="section section-bg">
                <div className="container">
                    <div style={{ textAlign: 'center' }}>
                        <div className="section-label">Events & Gallery</div>
                        <h2 className="section-title">Life at Vidya Vikas School</h2>
                        <p className="section-subtitle" style={{ margin: '0 auto' }}>
                            Celebrations, events, and memories that make our school a vibrant community.
                        </p>
                    </div>
                    {galleryLoading ? (
                        <div className="home-gallery-status">Loading slider images...</div>
                    ) : galleryError ? (
                        <div className="home-gallery-status">{galleryError}</div>
                    ) : galleryImages.length === 0 ? (
                        <div className="home-gallery-status">No gallery images yet. Upload from Admin Panel to show slider here.</div>
                    ) : activeSlides.length === 0 ? (
                        <div className="home-gallery-status">
                            All images are removed from this view.
                            <button className="btn btn-outline" style={{ marginLeft: 12 }} onClick={() => setDismissedImageIds([])}>
                                Restore Images
                            </button>
                        </div>
                    ) : (
                        <div className="home-gallery-slider" aria-label="Homepage image slider">
                            <div
                                className="home-gallery-track"
                                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                            >
                                {activeSlides.map((img, idx) => (
                                    <div className="home-gallery-slide" key={img.id}>
                                        <img
                                            src={img.image_url}
                                            alt={img.event_title || `School Event ${idx + 1}`}
                                            onError={(e) => {
                                                if (e.currentTarget.dataset.fallbackApplied) return;
                                                e.currentTarget.dataset.fallbackApplied = 'true';
                                                e.currentTarget.src = '/vidyavikas-school.jpeg';
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="home-gallery-cancel"
                                            aria-label={`Remove ${img.event_title || 'image'} from slider`}
                                            title="Remove this image"
                                            onClick={() => dismissSlide(img.id)}
                                        >
                                            <X size={16} />
                                        </button>
                                        <div className="home-gallery-caption">{img.event_title || 'School Event'}</div>
                                    </div>
                                ))}
                            </div>

                            {activeSlides.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        className="home-gallery-nav prev"
                                        onClick={goToPrevSlide}
                                        aria-label="Previous slide"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        type="button"
                                        className="home-gallery-nav next"
                                        onClick={goToNextSlide}
                                        aria-label="Next slide"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                    <div className="home-gallery-dots" role="tablist" aria-label="Slider pagination">
                                        {activeSlides.map((img, idx) => (
                                            <button
                                                key={img.id}
                                                type="button"
                                                className={`home-gallery-dot${currentSlide === idx ? ' active' : ''}`}
                                                onClick={() => setCurrentSlide(idx)}
                                                aria-label={`Go to slide ${idx + 1}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                    <div className="gallery-center">
                        <button className="btn btn-primary" onClick={() => go('/gallery')}>
                            View Full Gallery <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </section>

            {/* ── ADMISSIONS ── */}
            <section className="admissions-section" id="admissions">
                <div className="container">
                    <div className="admissions-grid">
                        {/* Left – Steps */}
                        <div>
                            <div className="section-label" style={{ color: 'rgba(255,255,255,0.7)' }}>Admissions</div>
                            <h2 className="section-title" style={{ color: 'white' }}>
                                Simple & Transparent Admission Process
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15, lineHeight: 1.8, marginBottom: 12 }}>
                                We've made the admission process straightforward and transparent. Our team is always available to guide you through every step.
                            </p>
                            <div className="admission-steps">
                                {admissionSteps.map((step, i) => (
                                    <div className="step-item" key={i}>
                                        <div className="step-num">{step.num}</div>
                                        <div className="step-content">
                                            <h4>{step.title}</h4>
                                            <p>{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right – Form */}
                        <div className="admission-form">
                            <div className="form-title">Enquire Now</div>
                            <p className="form-subtitle">Fill in the details and our admissions team will contact you within 24 hours.</p>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Parent / Guardian Name *</label>
                                    <input type="text" placeholder="Full Name" />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number *</label>
                                    <input type="tel" placeholder="+91 XXXXX XXXXX" />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Student's Name *</label>
                                    <input type="text" placeholder="Student's Full Name" />
                                </div>
                                <div className="form-group">
                                    <label>Applying for Grade *</label>
                                    <select>
                                        <option value="">Select Grade</option>
                                        <option>Pre-KG / LKG / UKG</option>
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(g => <option key={g}>Class {g}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Message (Optional)</label>
                                <textarea rows={3} placeholder="Any specific query or message..." />
                            </div>
                            <button className="form-submit">
                                Submit Enquiry 🎓
                            </button>
                            <p style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 12, textAlign: 'center' }}>
                                📞 Or call us directly: <strong>+91 98765 43210</strong>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            ── TESTIMONIALS ──
            <section className="section section-bg">
                <div className="container">
                    <div style={{ textAlign: 'center' }}>
                        <div className="section-label">Testimonials</div>
                        <h2 className="section-title">What Parents Say About Us</h2>
                        <p className="section-subtitle" style={{ margin: '0 auto' }}>
                            The trust and satisfaction of our school families is our greatest achievement.
                        </p>
                    </div>
                    <div className="testimonials-grid" style={{ marginTop: 48 }}>
                        {testimonials.map((t, i) => (
                            <div className="testimonial-card" key={i}>
                                <div className="stars">★★★★★</div>
                                <div className="quote-icon">"</div>
                                <p className="testimonial-text">{t.text}</p>
                                <div className="testimonial-author">
                                    <div className="author-avatar">{t.initial}</div>
                                    <div>
                                        <div className="author-name">{t.name}</div>
                                        <div className="author-role">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CONTACT ── */}
            <section className="section">
                <div className="container">
                    <div className="contact-grid">
                        {/* Left – Info */}
                        <div>
                            <div className="section-label">Location & Contact</div>
                            <h2 className="section-title">Visit Us or Get in Touch</h2>
                            <div className="contact-info">
                                <div className="contact-item">
                                    <div className="contact-icon"><MapPin size={20} /></div>
                                    <div className="contact-detail">
                                        <h4>School Address</h4>
                                        <p>Teachers Colony,<br />Satyanarayanapuram,<br />Gudivada, Andhra Pradesh,521301,India</p>
                                    </div>
                                </div>
                                <div className="contact-item">
                                    <div className="contact-icon"><Phone size={20} /></div>
                                    <div className="contact-detail">
                                        <h4>Phone Numbers</h4>
                                        <p>+91 7386640005 (Admissions)<br />+91 8142712666 (Office)</p>
                                    </div>
                                </div>
                                <div className="contact-item">
                                    <div className="contact-icon"><Mail size={20} /></div>
                                    <div className="contact-detail">
                                        <h4>Email Address</h4>
                                        <p>vidyavikas@gmail.com</p>
                                    </div>
                                </div>
                                <div className="contact-item">
                                    <div className="contact-icon"><Clock size={20} /></div>
                                    <div className="contact-detail">
                                        <h4>School Timings</h4>
                                        <p>School Hours: 8:00 AM – 2:30 PM<br />Office Hours: 9:00 AM – 5:00 PM<br />Monday to Saturday</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right – Map Placeholder */}
                        <div className="contact-right">
                            <a
                                className="map-placeholder"
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
                            <div style={{ marginTop: 28 }}>
                                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: 12 }} onClick={() => go('/contact')}>
                                    Send Us a Message
                                </button>
                                <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }} onClick={() => go('/admissions')}>
                                    Enquire About Admissions
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}





