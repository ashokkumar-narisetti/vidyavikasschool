import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Pencil, X, Upload } from 'lucide-react';

const emptyForm = { student_name: '', title: '', year: '', description: '', image_url: '', photoFile: null };
const RLS_ERROR_CODE = '42501';

const formatSupabaseError = (err, fallback) => {
    if (!err) return fallback;
    if (err.code === RLS_ERROR_CODE) {
        return 'Database permissions are blocking this action. Add an RLS policy to allow authenticated admin users to manage achievements.';
    }
    return err.message || fallback;
};

export default function AdminAchievements() {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        setLoading(true);
        const { data, error: fetchError } = await supabase
            .from('achievements')
            .select('*')
            .order('created_at', { ascending: false });

        if (fetchError) {
            setError(formatSupabaseError(fetchError, 'Unable to load achievements.'));
            setAchievements([]);
            setLoading(false);
            return;
        }

        setAchievements(data ?? []);
        setLoading(false);
    };

    const handleEdit = (ach) => {
        setEditing(ach.id);
        setForm({ ...ach, photoFile: null });
        setShowForm(true);
        setError('');
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditing(null);
        setForm(emptyForm);
        setError('');
    };

    const uploadPhoto = async (file) => {
        const ext = file.name.split('.').pop();
        const path = `achievements/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from('school-assets').upload(path, file, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('school-assets').getPublicUrl(path);
        return publicUrl;
    };

    const handleSave = async (e) => {
        e.preventDefault();

        const studentName = form.student_name.trim();
        const achievementTitle = form.title.trim();
        const achievementYear = form.year.trim();
        const description = form.description.trim();

        if (!studentName || !achievementTitle || !achievementYear) {
            setError('Student name, title, and year are required.');
            return;
        }

        setError('');
        setSaving(true);

        let imageUrl = form.image_url;
        if (form.photoFile) {
            try {
                imageUrl = await uploadPhoto(form.photoFile);
            } catch (uploadErr) {
                setError(formatSupabaseError(uploadErr, 'Photo upload failed.'));
                setSaving(false);
                return;
            }
        }

        const payload = {
            student_name: studentName,
            title: achievementTitle,
            year: achievementYear,
            description,
            image_url: imageUrl,
        };

        let saveError = null;
        if (editing) {
            const { error: updateError } = await supabase.from('achievements').update(payload).eq('id', editing);
            saveError = updateError;
        } else {
            const { error: insertError } = await supabase.from('achievements').insert(payload);
            saveError = insertError;
        }

        if (saveError) {
            setError(formatSupabaseError(saveError, 'Unable to save achievement.'));
            setSaving(false);
            return;
        }

        setSaving(false);
        handleCancel();
        await fetchAchievements();
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this achievement?')) return;

        const { error: deleteError } = await supabase.from('achievements').delete().eq('id', id);
        if (deleteError) {
            setError(formatSupabaseError(deleteError, 'Unable to delete achievement.'));
            return;
        }

        setAchievements(prev => prev.filter(a => a.id !== id));
    };

    return (
        <div>
            <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h2 className="admin-page-title">Student Achievements</h2>
                    <p className="admin-page-sub">Add and manage student achievements, toppers, and competition winners.</p>
                </div>
                {!showForm && (
                    <button className="admin-btn-primary" onClick={() => setShowForm(true)}>
                        <Plus size={16} /> Add Achievement
                    </button>
                )}
            </div>

            {error && !showForm && <div className="admin-error-banner" style={{ marginBottom: 14 }}>{error}</div>}

            {showForm && (
                <div className="admin-card" style={{ marginBottom: 28 }}>
                    <div className="admin-card-header">
                        <h3>{editing ? 'Edit Achievement' : 'Add New Achievement'}</h3>
                        <button onClick={handleCancel} className="admin-modal-close"><X size={18} /></button>
                    </div>
                    {error && <div className="admin-error-banner">{error}</div>}
                    <form onSubmit={handleSave} className="admin-achievement-form">
                        <div className="admin-form-row">
                            <div className="admin-form-group">
                                <label>Student Name *</label>
                                <input
                                    className="admin-input"
                                    placeholder="Full Name"
                                    value={form.student_name}
                                    onChange={e => setForm(f => ({ ...f, student_name: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>Title *</label>
                                <input
                                    className="admin-input"
                                    placeholder="e.g. School Topper, Olympiad Winner"
                                    value={form.title}
                                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                    required
                                />
                            </div>
                        </div>
                        <div className="admin-form-row">
                            <div className="admin-form-group">
                                <label>Year *</label>
                                <input
                                    className="admin-input"
                                    placeholder="e.g. 2023-24"
                                    value={form.year}
                                    onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>Student Photo</label>
                                <label className="admin-file-label">
                                    <Upload size={16} />
                                    {form.photoFile ? form.photoFile.name : 'Choose photo'}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={e => setForm(f => ({ ...f, photoFile: e.target.files?.[0] ?? null }))}
                                    />
                                </label>
                            </div>
                        </div>
                        <div className="admin-form-group">
                            <label>Description</label>
                            <textarea
                                className="admin-input"
                                rows={3}
                                placeholder="Achievement details..."
                                value={form.description}
                                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            <button type="submit" className="admin-btn-primary" disabled={saving}>
                                {saving ? 'Saving...' : (editing ? 'Update Achievement' : 'Save Achievement')}
                            </button>
                            <button type="button" className="admin-btn-secondary" onClick={handleCancel}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="admin-card">
                <div className="admin-card-header">
                    <h3>All Achievements</h3>
                    <span className="admin-badge">{achievements.length} total</span>
                </div>
                {loading ? (
                    <div className="admin-loading">Loading achievements...</div>
                ) : achievements.length === 0 ? (
                    <div className="admin-empty">No achievements added yet.</div>
                ) : (
                    <div className="admin-ach-grid">
                        {achievements.map(ach => (
                            <div key={ach.id} className="admin-ach-card">
                                {ach.image_url ? (
                                    <img src={ach.image_url} alt={ach.student_name} className="admin-ach-photo" />
                                ) : (
                                    <div className="admin-ach-photo-placeholder">No Photo</div>
                                )}
                                <div className="admin-ach-info">
                                    <div className="admin-ach-name">{ach.student_name}</div>
                                    <div className="admin-ach-title">{ach.title}</div>
                                    <div className="admin-ach-year">{ach.year}</div>
                                    {ach.description && <p className="admin-ach-desc">{ach.description}</p>}
                                </div>
                                <div className="admin-ach-actions">
                                    <button className="admin-icon-btn view" onClick={() => handleEdit(ach)} title="Edit">
                                        <Pencil size={14} />
                                    </button>
                                    <button className="admin-icon-btn delete" onClick={() => handleDelete(ach.id)} title="Delete">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
