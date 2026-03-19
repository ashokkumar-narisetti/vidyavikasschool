import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { getActivePopupBanners } from '../lib/popupBannersApi';

const SESSION_STATE_KEY = 'vv_popup_banner_session_state_v1';
const DAILY_STATE_KEY = 'vv_popup_banner_daily_state_v1';

const readState = (storage, key) => {
    try {
        const parsed = JSON.parse(storage.getItem(key) || '{}');
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
        return {};
    }
};

const writeState = (storage, key, value) => {
    try {
        storage.setItem(key, JSON.stringify(value));
    } catch {
        // Ignore storage failures without breaking rendering.
    }
};

const getToday = () => new Date().toISOString().slice(0, 10);

const hasBeenShownForFrequency = (banner, sessionState, dailyState, today) => {
    const id = String(banner.id);
    if (banner.show_frequency === 'daily') {
        const dailyInfo = dailyState[id];
        return dailyInfo?.lastShownDate === today || dailyInfo?.lastDismissedDate === today;
    }
    const sessionInfo = sessionState[id];
    return Boolean(sessionInfo?.lastShownAt || sessionInfo?.lastDismissedAt);
};

const markAsShown = (banners) => {
    if (!banners.length) return;
    const now = new Date().toISOString();
    const today = getToday();
    const sessionState = readState(window.sessionStorage, SESSION_STATE_KEY);
    const dailyState = readState(window.localStorage, DAILY_STATE_KEY);

    banners.forEach((banner) => {
        const id = String(banner.id);
        if (banner.show_frequency === 'daily') {
            dailyState[id] = {
                ...(dailyState[id] || {}),
                lastShownAt: now,
                lastShownDate: today,
            };
        } else {
            sessionState[id] = {
                ...(sessionState[id] || {}),
                lastShownAt: now,
            };
        }
    });

    writeState(window.sessionStorage, SESSION_STATE_KEY, sessionState);
    writeState(window.localStorage, DAILY_STATE_KEY, dailyState);
};

const markAsDismissed = (banners) => {
    if (!banners.length) return;
    const now = new Date().toISOString();
    const today = getToday();
    const sessionState = readState(window.sessionStorage, SESSION_STATE_KEY);
    const dailyState = readState(window.localStorage, DAILY_STATE_KEY);

    banners.forEach((banner) => {
        const id = String(banner.id);
        if (banner.show_frequency === 'daily') {
            dailyState[id] = {
                ...(dailyState[id] || {}),
                lastDismissedAt: now,
                lastDismissedDate: today,
            };
        } else {
            sessionState[id] = {
                ...(sessionState[id] || {}),
                lastDismissedAt: now,
            };
        }
    });

    writeState(window.sessionStorage, SESSION_STATE_KEY, sessionState);
    writeState(window.localStorage, DAILY_STATE_KEY, dailyState);
};

export default function HomePopupBannerModal() {
    const [banners, setBanners] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        let isMounted = true;
        const loadBanners = async () => {
            const { data, error } = await getActivePopupBanners();
            if (!isMounted || error || !data?.length) return;

            const sessionState = readState(window.sessionStorage, SESSION_STATE_KEY);
            const dailyState = readState(window.localStorage, DAILY_STATE_KEY);
            const today = getToday();

            const eligible = data.filter((banner) => (
                !hasBeenShownForFrequency(banner, sessionState, dailyState, today)
            ));

            if (!eligible.length) return;
            setBanners(eligible);
            setCurrentIndex(0);
            setIsVisible(true);
            markAsShown(eligible);
        };

        loadBanners();
        return () => { isMounted = false; };
    }, []);

    useEffect(() => {
        if (!isVisible || banners.length <= 1) return undefined;
        const timer = window.setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 4000);
        return () => window.clearInterval(timer);
    }, [isVisible, banners.length]);

    const activeBanner = useMemo(() => banners[currentIndex], [banners, currentIndex]);

    const handleClose = useCallback(() => {
        markAsDismissed(banners);
        setIsVisible(false);
    }, [banners]);

    const goNext = useCallback(() => {
        if (banners.length <= 1) return;
        setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, [banners.length]);

    const goPrev = useCallback(() => {
        if (banners.length <= 1) return;
        setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
    }, [banners.length]);

    useEffect(() => {
        if (!isVisible) return undefined;
        const previousOverflow = document.body.style.overflow;
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                handleClose();
            } else if (event.key === 'ArrowRight') {
                event.preventDefault();
                goNext();
            } else if (event.key === 'ArrowLeft') {
                event.preventDefault();
                goPrev();
            }
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [goNext, goPrev, handleClose, isVisible]);

    if (!isVisible || !activeBanner) return null;

    let safeRedirect = '';
    if (activeBanner.redirect_link?.trim()) {
        try {
            const parsedUrl = new URL(activeBanner.redirect_link.trim());
            if (['http:', 'https:'].includes(parsedUrl.protocol)) {
                safeRedirect = parsedUrl.toString();
            }
        } catch {
            safeRedirect = '';
        }
    }

    const hasRedirect = !!safeRedirect;
    const openRedirect = () => {
        if (!hasRedirect) return;
        window.open(safeRedirect, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="popup-banner-overlay open" role="presentation" onClick={handleClose}>
            <div
                className="popup-banner-modal open"
                role="dialog"
                aria-modal="true"
                aria-label={activeBanner.title || 'Achievement banner'}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    className="popup-banner-close"
                    aria-label="Close popup"
                    onClick={handleClose}
                >
                    <X size={18} />
                </button>

                <div className="popup-banner-media-wrap">
                    {hasRedirect ? (
                        <button type="button" className="popup-banner-media-link" onClick={openRedirect}>
                            <img src={activeBanner.image_url} alt={activeBanner.title || 'Popup banner'} loading="lazy" />
                        </button>
                    ) : (
                        <img src={activeBanner.image_url} alt={activeBanner.title || 'Popup banner'} loading="lazy" />
                    )}

                    {banners.length > 1 && (
                        <>
                            <button type="button" className="popup-banner-nav prev" onClick={goPrev} aria-label="Previous banner">
                                <ChevronLeft size={18} />
                            </button>
                            <button type="button" className="popup-banner-nav next" onClick={goNext} aria-label="Next banner">
                                <ChevronRight size={18} />
                            </button>
                            <div className="popup-banner-dots floating" role="tablist" aria-label="Popup banner list">
                                {banners.map((banner, idx) => (
                                    <button
                                        key={banner.id}
                                        type="button"
                                        className={`popup-banner-dot${idx === currentIndex ? ' active' : ''}`}
                                        onClick={() => setCurrentIndex(idx)}
                                        aria-label={`Show popup ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
