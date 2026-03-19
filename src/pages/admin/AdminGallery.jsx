import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

export default function AdminGallery() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => { fetchImages(); }, []);

    const fetchImages = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('gallery')
            .select('*')
            .order('created_at', { ascending: false });
        setImages(data ?? []);
        setLoading(false);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !title.trim()) { setError('Please provide both an image and a title.'); return; }
        setError(''); setUploading(true);
        const ext = file.name.split('.').pop();
        const fileName = `gallery/${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage
            .from('school-assets')
            .upload(fileName, file, { upsert: true });
        if (uploadErr) { setError('Upload failed: ' + uploadErr.message); setUploading(false); return; }
        const { data: { publicUrl } } = supabase.storage.from('school-assets').getPublicUrl(fileName);
        const { error: dbErr } = await supabase.from('gallery').insert({ image_url: publicUrl, event_title: title.trim() });
        if (dbErr) { setError('Failed to save: ' + dbErr.message); setUploading(false); return; }
        setSuccess('Image uploaded successfully!');
        setTitle(''); setFile(null);
        e.target.reset();
        fetchImages();
        setUploading(false);
        setTimeout(() => setSuccess(''), 3000);
    };

    const handleDelete = async (img) => {
        if (!window.confirm(`Delete "${img.event_title}"?`)) return;
        // Extract storage path from URL
        const path = img.image_url.split('/school-assets/')[1];
        if (path) await supabase.storage.from('school-assets').remove([path]);
        await supabase.from('gallery').delete().eq('id', img.id);
        setImages(prev => prev.filter(i => i.id !== img.id));
    };

    return (
        <div>
            <div className="admin-page-header">
                <h2 className="admin-page-title">Event Gallery</h2>
                <p className="admin-page-sub">Upload and manage school event photos. Uploaded images appear on the homepage slider.</p>
            </div>

            {/* Upload Form */}
            <div className="admin-card" style={{ marginBottom: 28 }}>
                <div className="admin-card-header"><h3>Upload New Image</h3></div>
                {error && <div className="admin-error-banner">{error}</div>}
                {success && <div className="admin-success-banner">✅ {success}</div>}
                <form onSubmit={handleUpload} className="admin-upload-form">
                    <div className="admin-form-group">
                        <label>Event Title *</label>
                        <input
                            type="text"
                            placeholder="e.g. Annual Day 2024"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="admin-input"
                            required
                        />
                    </div>
                    <div className="admin-form-group">
                        <label>Image File *</label>
                        <label className="admin-file-label">
                            <ImageIcon size={18} />
                            {file ? file.name : 'Choose image (JPG, PNG, WEBP)'}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => setFile(e.target.files[0])}
                                style={{ display: 'none' }}
                                required
                            />
                        </label>
                    </div>
                    <button type="submit" className="admin-btn-primary" disabled={uploading}>
                        <Upload size={16} />
                        {uploading ? 'Uploading...' : 'Upload Image'}
                    </button>
                </form>
            </div>

            {/* Image Grid */}
            <div className="admin-card">
                <div className="admin-card-header">
                    <h3>Uploaded Images</h3>
                    <span className="admin-badge">{images.length} images</span>
                </div>
                {loading ? (
                    <div className="admin-loading">Loading gallery...</div>
                ) : images.length === 0 ? (
                    <div className="admin-empty">🖼️ No images uploaded yet.</div>
                ) : (
                    <div className="admin-gallery-grid">
                        {images.map(img => (
                            <div key={img.id} className="admin-gallery-item">
                                <img src={img.image_url} alt={img.event_title} />
                                <button
                                    type="button"
                                    className="admin-gallery-delete"
                                    onClick={() => handleDelete(img)}
                                    aria-label={`Delete ${img.event_title}`}
                                    title="Delete image"
                                >
                                    <X size={14} />
                                </button>
                                <div className="admin-gallery-overlay">
                                    <span className="admin-gallery-title">{img.event_title}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
