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
        <div
            className="fixed inset-0 z-[1400] flex items-center justify-center overflow-y-auto overscroll-contain bg-slate-900/25 p-2 backdrop-blur-xl sm:p-3 md:p-4"
            role="presentation"
            onClick={handleClose}
        >
            <div
                className="relative w-full max-w-[96vw] overflow-hidden rounded-2xl border border-white/20 bg-slate-950/95 shadow-[0_30px_90px_rgba(2,6,23,0.45)] sm:h-[90vh] sm:max-w-3xl sm:bg-slate-950 md:h-[92vh] md:max-w-5xl lg:max-w-6xl xl:max-w-7xl"
                role="dialog"
                aria-modal="true"
                aria-label={activeBanner.title || 'Achievement banner'}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    className="absolute right-2 top-2 z-30 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-slate-950/70 text-white backdrop-blur transition hover:scale-105 hover:bg-slate-950/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 sm:right-3 sm:top-3 sm:h-10 sm:w-10"
                    aria-label="Close popup"
                    onClick={handleClose}
                >
                    <X size={18} />
                </button>

                <div className="relative w-full overflow-hidden bg-transparent sm:h-full sm:bg-slate-950">
                    {hasRedirect ? (
                        <button
                            type="button"
                            className="block w-full sm:h-full"
                            onClick={openRedirect}
                            aria-label="Open banner details"
                        >
                            <img
                                src={activeBanner.image_url}
                                alt={activeBanner.title || 'Popup banner'}
                                loading="lazy"
                                className="w-full h-auto object-contain sm:h-full sm:object-cover"
                            />
                        </button>
                    ) : (
                        <img
                            src={activeBanner.image_url}
                            alt={activeBanner.title || 'Popup banner'}
                            loading="lazy"
                            className="w-full h-auto object-contain sm:h-full sm:object-cover"
                        />
                    )}

                    {banners.length > 1 && (
                        <>
                            <button
                                type="button"
                                className="absolute left-2 top-1/2 z-20 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg transition hover:scale-105 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 sm:left-3 sm:h-11 sm:w-11"
                                onClick={goPrev}
                                aria-label="Previous banner"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 z-20 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg transition hover:scale-105 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 sm:right-3 sm:h-11 sm:w-11"
                                onClick={goNext}
                                aria-label="Next banner"
                            >
                                <ChevronRight size={18} />
                            </button>
                            <div
                                className="absolute bottom-2 right-2 z-20 flex items-center gap-2 rounded-full border border-white/20 bg-slate-900/55 px-2 py-1.5 backdrop-blur sm:bottom-3 sm:right-3"
                                role="tablist"
                                aria-label="Popup banner list"
                            >
                                {banners.map((banner, idx) => (
                                    <button
                                        key={banner.id}
                                        type="button"
                                        className={`h-2.5 w-2.5 rounded-full transition ${
                                            idx === currentIndex
                                                ? 'scale-110 bg-orange-400'
                                                : 'bg-slate-300/70 hover:bg-slate-100'
                                        }`}
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
