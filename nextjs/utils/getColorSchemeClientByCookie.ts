export default function getColorSchemeClientByCookie() {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        throw new Error("Illegal client cookie read in server context.");
    }

    // Parse document.cookie synchronously. Returns 'dark'|'light' or undefined.
    const cookieString = document.cookie || "";
    const parts = cookieString.split('; ').map(p => p.split('='));
    const found = parts.find(([name]) => name === 'colorScheme');
    const value = found ? decodeURIComponent(found[1] || '') : undefined;
    if (value === 'light' || value === 'dark') return value;
    return undefined;
}