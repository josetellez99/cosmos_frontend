export const API_URL = import.meta.env.VITE_API_URL
export const MILISECONS_AMOUNT_IN_10_MINUTES = 10 * 60 * 1000;
export const DEFAULT_STALE_TIME = MILISECONS_AMOUNT_IN_10_MINUTES

export const CSRF_COOKIE_NAME = 'cosmos_csrf_token';

export const CSRF_HEADER_NAME = 'X-CSRF-Token';

/* colors */

export const soft_destructive = "#ffe2e2"; // red-100
export const soft_warning = "#fef9c2" // yellow-100
export const soft_success = "#dcfce7" // lime-100
export const soft_completed = "#dbeafe" // bllue-100

export const colors_progress_config = {
    35: soft_destructive,
    60: soft_warning,
    90: soft_success,
    100: soft_completed
}