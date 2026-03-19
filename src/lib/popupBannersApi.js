import { supabase } from './supabase';

const POPUP_TABLE = 'popup_banners';
const STORAGE_BUCKET = 'school-assets';
const STORAGE_FOLDER = 'popup-banners';
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const buildError = (message) => ({ data: null, error: new Error(message) });

const fileToImageElement = (file) => new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
        URL.revokeObjectURL(url);
        resolve(image);
    };
    image.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Invalid image file.'));
    };
    image.src = url;
});

const canvasToBlob = (canvas, type, quality) => new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
        if (!blob) {
            reject(new Error('Image optimization failed.'));
            return;
        }
        resolve(blob);
    }, type, quality);
});

export const validatePopupBannerFile = (file) => {
    if (!file) return 'Please select an image file.';
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return 'Only JPG, PNG, or WEBP images are allowed.';
    }
    if (file.size > MAX_FILE_SIZE) {
        return 'Image size must be less than 2MB.';
    }
    return '';
};

export const optimizePopupBannerImage = async (file) => {
    const image = await fileToImageElement(file);

    const maxWidth = 1600;
    const maxHeight = 900;
    const ratio = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
    const targetWidth = Math.max(1, Math.floor(image.width * ratio));
    const targetHeight = Math.max(1, Math.floor(image.height * ratio));

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Unable to process image.');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

    const blob = await canvasToBlob(canvas, 'image/webp', 0.82);
    if (blob.size > MAX_FILE_SIZE) {
        throw new Error('Optimized image is still larger than 2MB. Please upload a smaller image.');
    }

    const fileName = `${file.name.replace(/\.[^/.]+$/, '') || 'popup-banner'}.webp`;
    return new File([blob], fileName, { type: 'image/webp' });
};

export const uploadPopupBannerImage = async (file) => {
    const validationError = validatePopupBannerFile(file);
    if (validationError) return buildError(validationError);

    let optimizedFile = file;
    try {
        optimizedFile = await optimizePopupBannerImage(file);
    } catch (err) {
        return buildError(err.message || 'Image optimization failed.');
    }

    const filePath = `${STORAGE_FOLDER}/${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;

    const { error: uploadError } = await supabase
        .storage
        .from(STORAGE_BUCKET)
        .upload(filePath, optimizedFile, { upsert: true, contentType: 'image/webp' });

    if (uploadError) return buildError(uploadError.message);

    const { data: publicData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);

    return { data: { imageUrl: publicData.publicUrl, filePath }, error: null };
};

export const removePopupBannerImageByUrl = async (imageUrl) => {
    if (!imageUrl) return { error: null };
    const marker = `${STORAGE_BUCKET}/`;
    const markerIndex = imageUrl.indexOf(marker);
    if (markerIndex === -1) return { error: null };

    const path = imageUrl.slice(markerIndex + marker.length).split('?')[0];
    if (!path || !path.startsWith(`${STORAGE_FOLDER}/`)) return { error: null };

    const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([path]);
    return { error };
};

export const getPopupBanners = async () => {
    const { data, error } = await supabase
        .from(POPUP_TABLE)
        .select('*')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });

    return { data: data ?? [], error };
};

export const createPopupBanner = async (payload) => {
    const { data, error } = await supabase
        .from(POPUP_TABLE)
        .insert(payload)
        .select('*')
        .single();

    return { data, error };
};

export const updatePopupBanner = async (id, payload) => {
    const { data, error } = await supabase
        .from(POPUP_TABLE)
        .update(payload)
        .eq('id', id)
        .select('*')
        .single();

    return { data, error };
};

export const deletePopupBanner = async (id) => {
    const { error } = await supabase
        .from(POPUP_TABLE)
        .delete()
        .eq('id', id);

    return { error };
};

export const getActivePopupBanners = async () => {
    const today = new Date().toISOString().slice(0, 10);

    const { data, error } = await supabase
        .from(POPUP_TABLE)
        .select('id, image_url, title, caption, redirect_link, priority, is_active, show_frequency, start_date, end_date')
        .eq('is_active', true)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });

    if (error) return { data: [], error };

    const filtered = (data ?? []).filter((item) => {
        const startOk = !item.start_date || item.start_date <= today;
        const endOk = !item.end_date || item.end_date >= today;
        return startOk && endOk;
    });

    return { data: filtered, error: null };
};

