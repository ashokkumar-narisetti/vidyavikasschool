import { useEffect, useMemo, useState } from 'react';
import {
    Plus, Upload, Image as ImageIcon, Pencil, Trash2, Power, PowerOff, X
} from 'lucide-react';
import {
    getPopupBanners,
    createPopupBanner,
    updatePopupBanner,
    deletePopupBanner,
    uploadPopupBannerImage,
    removePopupBannerImageByUrl,
} from '../../lib/popupBannersApi';

const getInitialForm = () => ({
    title: '',
    caption: '',
    redirect_link: '',
    priority: 100,
    is_active: true,
    show_frequency: 'session',
    start_date: '',
    end_date: '',
    image_url: '',
    imageFile: null,
});

export default function AdminPopupBanners() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(getInitialForm());
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchBanners();
    }, []);

    const previewImageUrl = useMemo(() => {
        if (form.imageFile) return URL.createObjectURL(form.imageFile);
        return form.image_url || '';
    }, [form.imageFile, form.image_url]);

    useEffect(() => () => {
        if (form.imageFile && previewImageUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewImageUrl);
        }
    }, [form.imageFile, previewImageUrl]);

    const fetchBanners = async () => {
        setLoading(true);
        setError('');
        const { data, error: fetchError } = await getPopupBanners();
        if (fetchError) {
            setError(`Unable to load popup banners: ${fetchError.message}`);
        } else {
            setBanners(data);
        }
        setLoading(false);
    };

    const resetForm = () => {
        setForm(getInitialForm());
        setEditingId(null);
        setShowForm(false);
    };

    const openCreateForm = () => {
        setError('');
        setSuccess('');
        setForm(getInitialForm());
        setEditingId(null);
        setShowForm(true);
    };

    const openEditForm = (banner) => {
        setError('');
        setSuccess('');
        setEditingId(banner.id);
        setForm({
            title: banner.title || '',
            caption: banner.caption || '',
            redirect_link: banner.redirect_link || '',
            priority: banner.priority ?? 100,
            is_active: !!banner.is_active,
            show_frequency: banner.show_frequency || 'session',
            start_date: banner.start_date || '',
            end_date: banner.end_date || '',
            image_url: banner.image_url || '',
            imageFile: null,
        });
        setShowForm(true);
    };

    const validateForm = () => {
        if (!form.imageFile && !form.image_url) return 'Banner image is required.';
        if (form.end_date && form.start_date && form.end_date < form.start_date) {
            return 'End date cannot be before start date.';
        }
        if (form.redirect_link.trim()) {
            try {
                const url = new URL(form.redirect_link.trim());
                if (!['http:', 'https:'].includes(url.protocol)) {
                    return 'Redirect link must use http or https.';
                }
            } catch {
                return 'Redirect link must be a valid URL.';
            }
        }
        return '';
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setSaving(true);
        const existingBanner = editingId ? banners.find((b) => b.id === editingId) : null;
        let imageUrl = form.image_url;

        if (form.imageFile) {
            const { data: uploadData, error: uploadError } = await uploadPopupBannerImage(form.imageFile);
            if (uploadError) {
                setError(uploadError.message || 'Image upload failed.');
                setSaving(false);
                return;
            }
            imageUrl = uploadData.imageUrl;
        }

        const payload = {
            image_url: imageUrl,
            title: form.title.trim() || null,
            caption: form.caption.trim() || null,
            redirect_link: form.redirect_link.trim() || null,
            priority: Number(form.priority) || 0,
            is_active: !!form.is_active,
            show_frequency: form.show_frequency,
            start_date: form.start_date || null,
            end_date: form.end_date || null,
            updated_at: new Date().toISOString(),
        };

        if (editingId) {
            const { error: updateError } = await updatePopupBanner(editingId, payload);
            if (updateError) {
                setError(updateError.message || 'Unable to update popup banner.');
                setSaving(false);
                return;
            }

            if (form.imageFile && existingBanner?.image_url && existingBanner.image_url !== imageUrl) {
                await removePopupBannerImageByUrl(existingBanner.image_url);
            }

            setSuccess('Popup banner updated.');
        } else {
            const { error: createError } = await createPopupBanner(payload);
            if (createError) {
                setError(createError.message || 'Unable to create popup banner.');
                setSaving(false);
                return;
            }
            setSuccess('Popup banner created.');
        }

        await fetchBanners();
        setSaving(false);
        resetForm();
        setTimeout(() => setSuccess(''), 2500);
    };

    const handleDelete = async (banner) => {
        const message = banner.title
            ? `Delete popup banner "${banner.title}"?`
            : 'Delete this popup banner?';
        if (!window.confirm(message)) return;

        setError('');
        setSuccess('');
        const { error: deleteError } = await deletePopupBanner(banner.id);
        if (deleteError) {
            setError(deleteError.message || 'Unable to delete popup banner.');
            return;
        }

        await removePopupBannerImageByUrl(banner.image_url);
        setBanners((prev) => prev.filter((item) => item.id !== banner.id));
        setSuccess('Popup banner deleted.');
        setTimeout(() => setSuccess(''), 2500);
    };

    const handleToggleActive = async (banner) => {
        const { data, error: updateError } = await updatePopupBanner(banner.id, {
            is_active: !banner.is_active,
            updated_at: new Date().toISOString(),
        });

        if (updateError) {
            setError(updateError.message || 'Unable to update banner status.');
            return;
        }

        setBanners((prev) => prev.map((item) => (item.id === banner.id ? data : item)));
    };

    return (
        <div>
            <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                <div>
                    <h2 className="admin-page-title">Popup Banners Management</h2>
                    <p className="admin-page-sub">
                        Manage homepage popup achievements with image, caption, link, priority, status, and frequency rules.
                    </p>
                </div>
                <button className="admin-btn-primary" onClick={openCreateForm}>
                    <Plus size={16} />
                    Add Popup Banner
                </button>
            </div>

            {error && <div className="admin-error-banner" style={{ marginBottom: 14 }}>{error}</div>}
            {success && <div className="admin-success-banner" style={{ marginBottom: 14 }}>✅ {success}</div>}

            {showForm && (
                <div className="admin-card" style={{ marginBottom: 28 }}>
                    <div className="admin-card-header">
                        <h3>{editingId ? 'Edit Popup Banner' : 'Create Popup Banner'}</h3>
                        <button className="admin-modal-close" onClick={resetForm} aria-label="Close form">
                            <X size={18} />
                        </button>
                    </div>
                    <form className="admin-upload-form" onSubmit={handleSave}>
                        <div className="admin-form-row">
                            <div className="admin-form-group">
                                <label>Banner Image *</label>
                                <label className="admin-file-label">
                                    <ImageIcon size={18} />
                                    {form.imageFile ? form.imageFile.name : 'Choose image (JPG, PNG, WEBP) under 2MB'}
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        style={{ display: 'none' }}
                                        onChange={(e) => {
                                            const selected = e.target.files?.[0] || null;
                                            setForm((prev) => ({ ...prev, imageFile: selected }));
                                        }}
                                    />
                                </label>
                            </div>
                            <div className="admin-form-group">
                                <label>Redirect Link (optional)</label>
                                <input
                                    type="url"
                                    className="admin-input"
                                    placeholder="https://example.com/achievement"
                                    value={form.redirect_link}
                                    onChange={(e) => setForm((prev) => ({ ...prev, redirect_link: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="admin-form-row">
                            <div className="admin-form-group">
                                <label>Title (optional)</label>
                                <input
                                    type="text"
                                    className="admin-input"
                                    placeholder="e.g. State Topper Achievement"
                                    value={form.title}
                                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>Priority *</label>
                                <input
                                    type="number"
                                    className="admin-input"
                                    min="0"
                                    value={form.priority}
                                    onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value }))}
                                    required
                                />
                            </div>
                        </div>

                        <div className="admin-form-group">
                            <label>Caption (optional)</label>
                            <textarea
                                className="admin-input"
                                rows={3}
                                placeholder="Short popup caption..."
                                value={form.caption}
                                onChange={(e) => setForm((prev) => ({ ...prev, caption: e.target.value }))}
                            />
                        </div>

                        <div className="admin-form-row">
                            <div className="admin-form-group">
                                <label>Show Frequency *</label>
                                <select
                                    className="admin-input"
                                    value={form.show_frequency}
                                    onChange={(e) => setForm((prev) => ({ ...prev, show_frequency: e.target.value }))}
                                >
                                    <option value="session">Once Per Session</option>
                                    <option value="daily">Once Per Day</option>
                                </select>
                            </div>
                            <div className="admin-form-group">
                                <label>Status</label>
                                <select
                                    className="admin-input"
                                    value={form.is_active ? 'active' : 'inactive'}
                                    onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.value === 'active' }))}
                                >
                                    <option value="active">Enabled</option>
                                    <option value="inactive">Disabled</option>
                                </select>
                            </div>
                        </div>

                        <div className="admin-form-row">
                            <div className="admin-form-group">
                                <label>Start Date (optional)</label>
                                <input
                                    type="date"
                                    className="admin-input"
                                    value={form.start_date}
                                    onChange={(e) => setForm((prev) => ({ ...prev, start_date: e.target.value }))}
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>End Date (optional)</label>
                                <input
                                    type="date"
                                    className="admin-input"
                                    value={form.end_date}
                                    onChange={(e) => setForm((prev) => ({ ...prev, end_date: e.target.value }))}
                                />
                            </div>
                        </div>

                        {previewImageUrl && (
                            <div className="admin-popup-preview-wrap">
                                <img src={previewImageUrl} alt="Popup banner preview" className="admin-popup-preview-img" />
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                            <button className="admin-btn-primary" type="submit" disabled={saving}>
                                <Upload size={16} />
                                {saving ? 'Saving...' : editingId ? 'Update Banner' : 'Create Banner'}
                            </button>
                            <button className="admin-btn-secondary" type="button" onClick={resetForm}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="admin-card">
                <div className="admin-card-header">
                    <h3>Configured Popups</h3>
                    <span className="admin-badge">{banners.length} total</span>
                </div>

                {loading ? (
                    <div className="admin-loading">Loading popup banners...</div>
                ) : banners.length === 0 ? (
                    <div className="admin-empty">No popup banners configured yet.</div>
                ) : (
                    <div className="admin-popup-grid">
                        {banners.map((banner) => (
                            <div key={banner.id} className="admin-popup-card">
                                <div className="admin-popup-image-wrap">
                                    <img src={banner.image_url} alt={banner.title || 'Popup Banner'} loading="lazy" />
                                    <div className={`admin-popup-status ${banner.is_active ? 'active' : 'inactive'}`}>
                                        {banner.is_active ? 'Enabled' : 'Disabled'}
                                    </div>
                                </div>

                                <div className="admin-popup-content">
                                    <div className="admin-popup-top">
                                        <div className="admin-popup-title">{banner.title || 'Untitled Banner'}</div>
                                        <div className="admin-popup-priority">Priority {banner.priority ?? 0}</div>
                                    </div>
                                    {banner.caption ? (
                                        <p className="admin-popup-caption">{banner.caption}</p>
                                    ) : (
                                        <p className="admin-popup-caption muted">No caption added.</p>
                                    )}

                                    <div className="admin-popup-meta">
                                        <span>Frequency: {banner.show_frequency === 'daily' ? 'Daily' : 'Session'}</span>
                                        <span>
                                            {banner.start_date || banner.end_date
                                                ? `${banner.start_date || 'Now'} to ${banner.end_date || 'No end'}`
                                                : 'Always active by date'}
                                        </span>
                                    </div>

                                    <div className="admin-popup-actions">
                                        <button className="admin-icon-btn view" onClick={() => openEditForm(banner)} title="Edit">
                                            <Pencil size={14} />
                                        </button>
                                        <button
                                            className={`admin-icon-btn ${banner.is_active ? 'view' : 'delete'}`}
                                            onClick={() => handleToggleActive(banner)}
                                            title={banner.is_active ? 'Disable' : 'Enable'}
                                        >
                                            {banner.is_active ? <PowerOff size={14} /> : <Power size={14} />}
                                        </button>
                                        <button className="admin-icon-btn delete" onClick={() => handleDelete(banner)} title="Delete">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

