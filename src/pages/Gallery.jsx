import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Gallery() {
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        setLoading(true);
        setError('');
        const { data, error: err } = await supabase
            .from('gallery')
            .select('*')
            .order('created_at', { ascending: false });

        if (err) {
            setError('Unable to load gallery. Please try again later.');
        } else {
            setImages(data ?? []);
        }
        setLoading(false);
    };

    return (
        <div className="page-wrapper">
            <section className="page-hero">
                <div className="container">
                    <div className="page-hero-content">
                        <div className="page-hero-label">School Gallery</div>
                        <h1 className="page-hero-title">Life at Vidya Vikas School</h1>
                        <p className="page-hero-sub">Capturing memories, milestones, and moments that define our school community.</p>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '80px 0' }}>
                            <div style={{
                                width: 44, height: 44, border: '4px solid var(--accent-light)',
                                borderTopColor: 'var(--primary)', borderRadius: '50%',
                                animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
                            }} />
                            <p style={{ color: 'var(--text-light)', fontSize: 15 }}>Loading gallery...</p>
                        </div>
                    ) : error ? (
                        <div style={{
                            textAlign: 'center', padding: '60px 20px',
                            background: 'var(--accent-light)', borderRadius: 'var(--radius-lg)',
                        }}>
                            <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
                            <h3 style={{ color: 'var(--primary)', marginBottom: 8 }}>Could not load gallery</h3>
                            <p style={{ color: 'var(--text-light)', fontSize: 14 }}>{error}</p>
                            <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={fetchGallery}>
                                Try Again
                            </button>
                        </div>
                    ) : images.length === 0 ? (
                        <div style={{
                            background: 'var(--accent-light)', borderRadius: 'var(--radius-lg)',
                            padding: '60px 32px', textAlign: 'center', border: '2px dashed var(--accent)',
                        }}>
                            <div style={{ fontSize: 40, marginBottom: 12 }}>📸</div>
                            <h3 style={{ color: 'var(--primary)', marginBottom: 8 }}>Gallery Coming Soon</h3>
                            <p style={{ color: 'var(--text-light)', fontSize: 14, maxWidth: 400, margin: '0 auto' }}>
                                Event photos will appear here as they are uploaded by the school administration.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Image count badge */}
                            <div style={{ marginBottom: 28, display: 'flex', alignItems: 'center', gap: 12 }}>
                                <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-dark)' }}>
                                    School Events &amp; Moments
                                </h2>
                                <span style={{
                                    background: 'var(--accent-light)', color: 'var(--accent)',
                                    fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 50,
                                }}>{images.length} photos</span>
                            </div>

                            {/* Dynamic image grid */}
                            <div className="gallery-page-grid" style={{ marginBottom: 40 }}>
                                {images.map((img) => (
                                    <div className="gallery-page-item" key={img.id}>
                                        <img
                                            src={img.image_url}
                                            alt={img.event_title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                            onError={e => {
                                                e.target.style.display = 'none';
                                                e.target.nextElementSibling.style.display = 'flex';
                                            }}
                                        />
                                        {/* Fallback if image fails */}
                                        <div style={{
                                            display: 'none', width: '100%', height: '100%',
                                            background: 'var(--accent-light)',
                                            alignItems: 'center', justifyContent: 'center',
                                            fontSize: 40, flexDirection: 'column', gap: 8,
                                        }}>
                                            <span>🖼️</span>
                                            <span style={{ fontSize: 12, color: 'var(--text-light)' }}>Image unavailable</span>
                                        </div>
                                        <div className="gallery-overlay">
                                            <span className="gallery-label">{img.event_title}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{
                                background: 'var(--accent-light)', borderRadius: 'var(--radius-lg)',
                                padding: '32px', textAlign: 'center', border: '2px dashed var(--accent)',
                            }}>
                                <div style={{ fontSize: 32, marginBottom: 12 }}>📸</div>
                                <h3 style={{ color: 'var(--primary)', marginBottom: 8 }}>More Photos Coming Soon</h3>
                                <p style={{ color: 'var(--text-light)', fontSize: 14, lineHeight: 1.8, maxWidth: 400, margin: '0 auto 20px' }}>
                                    We continuously update our gallery with the latest events and school life moments.
                                </p>
                                <button className="btn btn-primary" onClick={() => { navigate('/contact'); window.scrollTo(0, 0); }}>
                                    Contact Us for More Info
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}
