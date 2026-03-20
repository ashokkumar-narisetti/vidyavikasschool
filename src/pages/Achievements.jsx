import { useState, useEffect } from 'react';
import { Trophy, Medal, Star, Award } from 'lucide-react';
import { supabase } from '../lib/supabase';

const highlights = [
    { icon: <Trophy size={28} />, number: '100%', label: 'Board Pass Rate', sub: '10+ consecutive years' },
    { icon: <Medal size={28} />, number: '50+', label: 'District Rank Holders', sub: 'Every academic year' },
    { icon: <Star size={28} />, number: '200+', label: 'Olympiad Medals', sub: 'National & State level' },
    { icon: <Award size={28} />, number: '30+', label: 'Sports Titles', sub: 'District & State championships' },
];

const banners = [
    { emoji: '🏅', title: '100% SSC Results', sub: '2023–24', bg: 'linear-gradient(135deg, #7B2D35, #C8832A)' },
    { emoji: '🌟', title: 'Best School Award', sub: 'District Level – 2023', bg: 'linear-gradient(135deg, #8B5E3C, #C8832A)' },
    { emoji: '🎓', title: '34 Years of Excellence', sub: 'Est. 1992', bg: 'linear-gradient(135deg, #064E3B, #059669)' },
    { emoji: '🏆', title: 'Sports Champions', sub: 'District – 2023–24', bg: 'linear-gradient(135deg, #302b63, #764ba2)' },
];

export default function Achievements() {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        setLoading(true);
        setError('');
        const { data, error: err } = await supabase
            .from('achievements')
            .select('*')
            .order('created_at', { ascending: false });

        if (err) {
            setError('Unable to load achievements at this time.');
        } else {
            setAchievements(data ?? []);
        }
        setLoading(false);
    };

    return (
        <div className="page-wrapper">

            {/* ── PAGE HERO ── */}
            <section className="page-hero">
                <div className="container">
                    <div className="page-hero-content">
                        <div className="page-hero-label">Our Pride</div>
                        <h1 className="page-hero-title">Achievements & Excellence</h1>
                        <p className="page-hero-sub">
                            34+ years of producing district toppers, Olympiad champions, sports leaders, and proud alumni.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── HIGHLIGHTS ── */}
            <section style={{ background: 'var(--bg)', padding: '60px 0' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
                        {highlights.map((h, i) => (
                            <div key={i} style={{
                                background: '#fff', borderRadius: 'var(--radius-lg)', padding: '32px 24px',
                                textAlign: 'center', boxShadow: 'var(--shadow)', borderTop: '4px solid var(--primary)',
                            }}>
                                <div style={{
                                    width: 64, height: 64, borderRadius: 16, background: 'var(--accent-light)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 16px', color: 'var(--primary)',
                                }}>{h.icon}</div>
                                <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>{h.number}</div>
                                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-dark)', margin: '6px 0 4px' }}>{h.label}</div>
                                <div style={{ fontSize: 12, color: 'var(--text-light)' }}>{h.sub}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── AWARD BANNERS ── */}
            <section style={{ background: '#fff', padding: '60px 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: 40 }}>
                        <div className="section-label">Recognition</div>
                        <h2 className="section-title">Awards & Recognitions</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
                        {banners.map((b, i) => (
                            <div key={i} style={{
                                background: b.bg, borderRadius: 'var(--radius-lg)', padding: '40px 28px',
                                textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                                position: 'relative', overflow: 'hidden',
                            }}>
                                <div style={{
                                    position: 'absolute', top: -30, right: -30, width: 120, height: 120,
                                    background: 'rgba(255,255,255,0.08)', borderRadius: '50%', pointerEvents: 'none',
                                }} />
                                <div style={{ fontSize: 52, marginBottom: 12 }}>{b.emoji}</div>
                                <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 6 }}>{b.title}</div>
                                <div style={{
                                    display: 'inline-block', background: 'rgba(255,255,255,0.2)', color: '#fff',
                                    fontSize: 12, fontWeight: 600, padding: '4px 14px', borderRadius: 50,
                                }}>{b.sub}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── DYNAMIC ACHIEVEMENTS FROM SUPABASE ── */}
            <section style={{ background: 'var(--bg)', padding: '60px 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: 40 }}>
                        <div className="section-label">Student Excellence</div>
                        <h2 className="section-title">Our Champions</h2>
                        <p className="section-subtitle" style={{ margin: '0 auto' }}>
                            Celebrating our students' achievements in academics, competitions, and beyond.
                        </p>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '60px 0' }}>
                            <div style={{
                                width: 44, height: 44, border: '4px solid var(--accent-light)',
                                borderTopColor: 'var(--primary)', borderRadius: '50%',
                                animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
                            }} />
                            <p style={{ color: 'var(--text-light)' }}>Loading achievements...</p>
                        </div>
                    ) : error ? (
                        <div style={{
                            textAlign: 'center', padding: '40px', background: 'var(--accent-light)',
                            borderRadius: 'var(--radius-lg)',
                        }}>
                            <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
                            <p style={{ color: 'var(--text-light)', fontSize: 14 }}>{error}</p>
                            <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={fetchAchievements}>
                                Try Again
                            </button>
                        </div>
                    ) : achievements.length === 0 ? (
                        <div style={{
                            textAlign: 'center', padding: '48px', background: '#fff',
                            borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow)',
                        }}>
                            <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
                            <p style={{ color: 'var(--text-light)', fontSize: 15 }}>
                                Student achievements will appear here once added by the administration.
                            </p>
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 180px))',
                            gap: 16,
                            alignItems: 'start',
                            justifyContent: 'center',
                        }}>
                            {achievements.map((ach) => (
                                <div key={ach.id} style={{
                                    background: '#fff', borderRadius: 'var(--radius-lg)',
                                    boxShadow: 'var(--shadow)', overflow: 'hidden',
                                    border: '1px solid var(--border)',
                                    transition: 'var(--transition)',
                                    width: '100%',
                                }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    {/* Photo */}
                                    <div style={{
                                        background: 'var(--accent-light)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        overflow: 'hidden',
                                        height: 170,
                                        padding: 8,
                                    }}>
                                        {ach.image_url ? (
                                            <img
                                                src={ach.image_url}
                                                alt={ach.student_name}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'contain',
                                                    borderRadius: 8,
                                                    background: '#fff',
                                                }}
                                                onError={e => {
                                                    e.target.style.display = 'none';
                                                    e.target.parentElement.textContent = 'Image unavailable';
                                                }}
                                            />
                                        ) : (
                                            <span style={{ color: 'var(--text-light)', fontWeight: 600 }}>No Photo</span>
                                        )}
                                    </div>
                                    {/* Info */}
                                    <div style={{ padding: '12px 12px 14px' }}>
                                        <div style={{
                                            display: 'inline-block', background: 'var(--accent-light)',
                                            color: 'var(--accent)', fontSize: 10, fontWeight: 700,
                                            padding: '2px 8px', borderRadius: 50, marginBottom: 8,
                                        }}>{ach.year}</div>
                                        <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-dark)', marginBottom: 3 }}>
                                            {ach.student_name}
                                        </div>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)', marginBottom: 5 }}>
                                            {ach.title}
                                        </div>
                                        {ach.description && (
                                            <p style={{
                                                fontSize: 12,
                                                color: 'var(--text-light)',
                                                lineHeight: 1.45,
                                                margin: 0,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                            }}>
                                                {ach.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

        </div>
    );
}
