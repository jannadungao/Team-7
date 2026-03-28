export default function isDarkmodeClient() {
    // https://stackoverflow.com/questions/56393880/how-do-i-detect-dark-mode-using-javascript
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}