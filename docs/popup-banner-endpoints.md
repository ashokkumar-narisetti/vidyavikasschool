# Popup Banner API Contract

The app currently uses Supabase client calls through `src/lib/popupBannersApi.js`.
These methods map directly to the following endpoint contract:

## Admin API

- `POST /popup-banners` -> `createPopupBanner(payload)`
- `GET /popup-banners` -> `getPopupBanners()`
- `PUT /popup-banners/:id` -> `updatePopupBanner(id, payload)`
- `DELETE /popup-banners/:id` -> `deletePopupBanner(id)`

## Public API

- `GET /popup-banners/active` -> `getActivePopupBanners()`
  - Returns only active banners
  - Sorted by highest priority first
  - Filtered by optional start/end date window

## Upload Helpers

- `uploadPopupBannerImage(file)`:
  - File type validation: JPG/PNG/WEBP
  - File size validation: under 2MB
  - Client-side optimization to WEBP before upload
